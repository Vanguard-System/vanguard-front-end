// TwoFactorModal.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { verify2FA } from "@/services/auth";
import TwoFactorModal from ".";

jest.mock("@/services/auth", () => ({
  verify2FA: jest.fn(),
}));

describe("TwoFactorModal", () => {
  const email = "user@example.com";
  const onClose = jest.fn();
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with email", () => {
    render(<TwoFactorModal email={email} onClose={onClose} onSuccess={onSuccess} />);

    expect(screen.getByText(`Enviamos um código de verificação para`)).toBeInTheDocument();
    expect(screen.getByText(email)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Código 2FA")).toBeInTheDocument();
    expect(screen.getByText("Confirmar")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  it("shows error alert if code is empty", async () => {
    render(<TwoFactorModal email={email} onClose={onClose} onSuccess={onSuccess} />);

    fireEvent.click(screen.getByText("Confirmar"));

    expect(await screen.findByText("Digite o código")).toBeInTheDocument();
  });

  it("calls verify2FA and shows success alert", async () => {
    (verify2FA as jest.Mock).mockResolvedValue({});

    render(<TwoFactorModal email={email} onClose={onClose} onSuccess={onSuccess} />);

    const input = screen.getByPlaceholderText("Código 2FA");
    fireEvent.change(input, { target: { value: "123456" } });
    fireEvent.click(screen.getByText("Confirmar"));

    expect(screen.getByText("Verificando...")).toBeInTheDocument();

    await waitFor(() => expect(verify2FA).toHaveBeenCalledWith(email, "123456"));
    expect(await screen.findByText("Código verificado!")).toBeInTheDocument();

    // onSuccess should be called after timeout
    await waitFor(() => expect(onSuccess).toHaveBeenCalled(), { timeout: 1000 });
  });

  it("shows error alert on failed verification", async () => {
    (verify2FA as jest.Mock).mockRejectedValue({
      response: { data: { message: "Código inválido" } },
    });

    render(<TwoFactorModal email={email} onClose={onClose} onSuccess={onSuccess} />);

    const input = screen.getByPlaceholderText("Código 2FA");
    fireEvent.change(input, { target: { value: "WRONG" } });
    fireEvent.click(screen.getByText("Confirmar"));

    expect(await screen.findByText("Código inválido")).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("calls onClose when Cancelar button is clicked", () => {
    render(<TwoFactorModal email={email} onClose={onClose} onSuccess={onSuccess} />);

    fireEvent.click(screen.getByText("Cancelar"));

    expect(onClose).toHaveBeenCalled();
  });
});
