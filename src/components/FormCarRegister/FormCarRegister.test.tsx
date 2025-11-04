import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CarRegisterForm } from ".";

const toastMock = jest.fn();
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));

const mutateAsyncMock = jest.fn();
jest.mock("@/services/hooks/useCar", () => ({
  useCreateCar: () => ({ mutateAsync: mutateAsyncMock }),
}));

describe("CarRegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza corretamente os campos e botão", () => {
    render(<CarRegisterForm />);
    expect(screen.getByLabelText(/modelo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/placa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/consumo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preço fixo/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cadastrar carro/i })).toBeInTheDocument();
  });

  test("valida campos obrigatórios", async () => {
    render(<CarRegisterForm />);
    const button = screen.getByRole("button", { name: /cadastrar carro/i });
    fireEvent.click(button);

    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({
      title: "Erro",
      description: "Modelo é obrigatório",
    }));

    fireEvent.change(screen.getByLabelText(/modelo/i), { target: { value: "Modelo X" } });
    fireEvent.click(button);

    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({
      title: "Erro",
      description: "Placa é obrigatória",
    }));
  });

  test("chama mutateAsync e exibe toast de sucesso", async () => {
    mutateAsyncMock.mockResolvedValueOnce({});
    render(<CarRegisterForm />);

    fireEvent.change(screen.getByLabelText(/modelo/i), { target: { value: "Modelo X" } });
    fireEvent.change(screen.getByLabelText(/placa/i), { target: { value: "ABC-1234" } });
    fireEvent.change(screen.getByLabelText(/consumo/i), { target: { value: "8" } });
    fireEvent.change(screen.getByLabelText(/preço fixo/i), { target: { value: "500" } });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar carro/i }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        model: "Modelo X",
        plate: "ABC-1234",
        consumption: "8",
        fixed_cost: "500",
      });

      expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({
        title: "Sucesso",
        description: "Carro cadastrado com sucesso",
      }));
    });
  });

  test("exibe toast de erro ao falhar", async () => {
    mutateAsyncMock.mockRejectedValueOnce(new Error("Falha"));
    render(<CarRegisterForm />);

    fireEvent.change(screen.getByLabelText(/modelo/i), { target: { value: "Modelo X" } });
    fireEvent.change(screen.getByLabelText(/placa/i), { target: { value: "ABC-1234" } });

    fireEvent.click(screen.getByRole("button", { name: /cadastrar carro/i }));

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({
        title: "Erro",
        description: "Falha ao cadastrar carro",
      }));
    });
  });

  test("desabilita botão durante envio", async () => {
    let resolvePromise: () => void;
    const promise = new Promise<void>(resolve => { resolvePromise = resolve; });
    mutateAsyncMock.mockReturnValue(promise);

    render(<CarRegisterForm />);

    fireEvent.change(screen.getByLabelText(/modelo/i), { target: { value: "Modelo X" } });
    fireEvent.change(screen.getByLabelText(/placa/i), { target: { value: "ABC-1234" } });

    const button = screen.getByRole("button", { name: /cadastrar carro/i });
    fireEvent.click(button);

    expect(button).toBeDisabled();

    resolvePromise!();
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
