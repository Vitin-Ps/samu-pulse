class MessageService {
  // Atributos da classe
  private static alertHandler: ((message: string) => void) | null = null;
  private static successHandler: ((message: string) => void) | null = null;
  private static errorHandler: ((message: string) => void) | null = null;
  private static confirmHandler:
    | ((message: string, onConfirm: () => void) => void)
    | null = null;

  public static setAlertHandler(funcao: (message: string) => void) {
    this.alertHandler = funcao;
  }
  public static setSuccessHandler(funcao: (message: string) => void) {
    this.successHandler = funcao;
  }
  public static setErrorHandler(funcao: (message: string) => void) {
    this.errorHandler = funcao;
  }

  public static setConfirmHandler(
    funcao: (message: string, onConfirm: () => void) => void,
  ) {
    this.confirmHandler = funcao;
  }

  // aqui ele massa a função

  public static alertMessage(message: string) {
    if (this.alertHandler) {
      this.alertHandler(message);
    }
  }
  public static successMessage(message: string) {
    if (this.successHandler) {
      this.successHandler(message);
    }
  }
  public static errorMessage(message: string) {
    if (this.errorHandler) {
      this.errorHandler(message);
    }
  }

  public static confirmMessage(message: string, onConfirm: () => void) {
    if (this.confirmHandler) {
      this.confirmHandler(message, onConfirm);
    }
  }
}

export default MessageService;
