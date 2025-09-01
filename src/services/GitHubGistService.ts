import axios, { AxiosError } from "axios";
import type { AppData, GitHubGistResponse } from "../types";

export class GitHubGistService {
  private token: string;
  private gistId?: string;
  private baseURL = "https://api.github.com";

  constructor(token: string, gistId?: string) {
    this.token = token;
    this.gistId = gistId;
  }

  /**
   * Устанавливает ID существующего Gist
   */
  setGistId(gistId: string) {
    this.gistId = gistId;
  }

  /**
   * Получает ID текущего Gist
   */
  getGistId(): string | undefined {
    return this.gistId;
  }

  /**
   * Создает заголовки для запросов к GitHub API
   */
  private getHeaders() {
    return {
      Authorization: `token ${this.token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    };
  }

  /**
   * Сохраняет данные приложения в GitHub Gist
   */
  async saveAppData(data: AppData): Promise<string> {
    const gistData = {
      files: {
        "balance-data.json": {
          content: JSON.stringify(data, null, 2),
        },
      },
      description: "Balance App - Personal Finance Data Backup",
      public: false,
    };

    try {
      if (this.gistId) {
        // Обновление существующего Gist
        const response = await axios.patch<GitHubGistResponse>(
          `${this.baseURL}/gists/${this.gistId}`,
          gistData,
          { headers: this.getHeaders() }
        );
        return response.data.id;
      } else {
        // Создание нового Gist
        const response = await axios.post<GitHubGistResponse>(
          `${this.baseURL}/gists`,
          gistData,
          { headers: this.getHeaders() }
        );
        this.gistId = response.data.id;
        return response.data.id;
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Загружает данные приложения из GitHub Gist
   */
  async loadAppData(): Promise<AppData> {
    if (!this.gistId) {
      throw new Error("Gist ID не установлен");
    }

    try {
      const response = await axios.get<GitHubGistResponse>(
        `${this.baseURL}/gists/${this.gistId}`,
        { headers: this.getHeaders() }
      );

      const fileContent = response.data.files["balance-data.json"]?.content;
      if (!fileContent) {
        throw new Error("Файл данных не найден в Gist");
      }

      const data = JSON.parse(fileContent) as AppData;

      // Валидация структуры данных
      this.validateAppData(data);

      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Проверяет существование Gist по ID
   */
  async checkGistExists(gistId: string): Promise<boolean> {
    try {
      await axios.get<GitHubGistResponse>(`${this.baseURL}/gists/${gistId}`, {
        headers: this.getHeaders(),
      });
      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        return false;
      }
      throw this.handleError(error);
    }
  }

  /**
   * Получает список всех Gist пользователя
   */
  async getUserGists(): Promise<
    Array<{ id: string; description: string; updated_at: string }>
  > {
    try {
      const response = await axios.get(`${this.baseURL}/gists`, {
        headers: this.getHeaders(),
      });

      return response.data
        .filter((gist: any) => gist.description?.includes("Balance App"))
        .map((gist: any) => ({
          id: gist.id,
          description: gist.description,
          updated_at: gist.updated_at,
        }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Удаляет Gist
   */
  async deleteGist(gistId?: string): Promise<void> {
    const targetGistId = gistId || this.gistId;
    if (!targetGistId) {
      throw new Error("Gist ID не указан");
    }

    try {
      await axios.delete(`${this.baseURL}/gists/${targetGistId}`, {
        headers: this.getHeaders(),
      });

      if (targetGistId === this.gistId) {
        this.gistId = undefined;
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Проверяет валидность GitHub токена
   */
  async validateToken(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/user`, {
        headers: this.getHeaders(),
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Получает информацию о пользователе GitHub
   */
  async getUserInfo(): Promise<{ login: string; name: string; email: string }> {
    try {
      const response = await axios.get(`${this.baseURL}/user`, {
        headers: this.getHeaders(),
      });

      return {
        login: response.data.login,
        name: response.data.name || response.data.login,
        email: response.data.email || "",
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Валидирует структуру данных приложения
   */
  private validateAppData(data: any): void {
    if (!data || typeof data !== "object") {
      throw new Error("Неверная структура данных");
    }

    if (!Array.isArray(data.cards)) {
      throw new Error("Неверная структура данных: отсутствует массив карточек");
    }

    if (!Array.isArray(data.transactions)) {
      throw new Error(
        "Неверная структура данных: отсутствует массив транзакций"
      );
    }

    if (!data.settings || typeof data.settings !== "object") {
      throw new Error("Неверная структура данных: отсутствуют настройки");
    }

    if (!data.version) {
      throw new Error("Неверная структура данных: отсутствует версия");
    }
  }

  /**
   * Обрабатывает ошибки API
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        const status = axiosError.response.status;
        const message =
          (axiosError.response.data as any)?.message || axiosError.message;

        switch (status) {
          case 401:
            return new Error("Неверный GitHub токен");
          case 403:
            return new Error(
              "Превышены лимиты API GitHub или отсутствуют права доступа"
            );
          case 404:
            return new Error("Gist не найден");
          case 422:
            return new Error("Неверные данные для создания/обновления Gist");
          case 429:
            return new Error("Превышены лимиты запросов к API GitHub");
          default:
            return new Error(`Ошибка GitHub API (${status}): ${message}`);
        }
      } else if (axiosError.request) {
        return new Error(
          "Нет ответа от сервера GitHub. Проверьте подключение к интернету"
        );
      } else {
        return new Error(`Ошибка настройки запроса: ${axiosError.message}`);
      }
    }

    return new Error(`Неизвестная ошибка: ${String(error)}`);
  }
}

/**
 * Создает экземпляр GitHub Gist Service
 */
export const createGitHubGistService = (token: string, gistId?: string) => {
  return new GitHubGistService(token, gistId);
};
