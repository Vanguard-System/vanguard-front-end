import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordForm from ".";


const navigateMock = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

const mutateMock = jest.fn();
let isPendingMock = false;
let isSuccessMock = false;

jest.mock("@/services/hooks/useUsers", () => ({
  useRequestPasswordReset: () => ({
    mutate: mutateMock,
    isPending: isPendingMock,
    isSuccess: isSuccessMock,
  }),
}));

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isPendingMock = false;
    isSuccessMock = false;
  });

  test("renderiza corretamente os elementos", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByText("Esqueceu sua senha?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enviar código/i })).toBeInTheDocument();
  });

  test("envia email com sucesso", async () => {
    mutateMock.mockImplementation((_email, { onSuccess }) => {
      onSuccess?.();
    });

    render(<ForgotPasswordForm />);
    const input = screen.getByPlaceholderText("seu@email.com");
    const button = screen.getByRole("button", { name: /enviar código/i });

    fireEvent.change(input, { target: { value: "teste@email.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(
        "/reset-password?email=" + encodeURIComponent("teste@email.com")
      );
    });
  });

  test("exibe erro ao falhar no envio", async () => {
    mutateMock.mockImplementation((_email, { onError }) => {
      onError?.();
    });

    render(<ForgotPasswordForm />);
    const input = screen.getByPlaceholderText("seu@email.com");
    const button = screen.getByRole("button", { name: /enviar código/i });

    fireEvent.change(input, { target: { value: "teste@email.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Erro ao enviar o email/i)).toBeInTheDocument();
    });
  });

  test("mostra mensagem de sucesso quando isSuccess é true", () => {
    isSuccessMock = true; 
    render(<ForgotPasswordForm />);
    expect(screen.getByText(/Código enviado! Verifique seu email/i)).toBeInTheDocument();
  });

  test("desabilita botão durante envio", () => {
    isPendingMock = true; 
    render(<ForgotPasswordForm />);
    const button = screen.getByRole("button", { name: /Enviando/i });
    expect(button).toBeDisabled();
  });
});
