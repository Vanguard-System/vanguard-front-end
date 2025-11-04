import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { DriverRegistrationForm } from "."

const toastMock = jest.fn()
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}))

const mutateAsyncMock = jest.fn()
jest.mock("@/services/hooks/useDriver", () => ({
  useCreateDriver: () => ({
    mutateAsync: mutateAsyncMock,
  }),
}))

describe("DriverRegistrationForm", () => {
  beforeEach(() => {
    toastMock.mockClear()
    mutateAsyncMock.mockClear()
  })

  test("renderiza os campos e botão corretamente", () => {
    render(<DriverRegistrationForm />)

    expect(screen.getByPlaceholderText(/Digite o nome completo/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/000.000.000-00/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/exemplo@email.com/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Custo por motorista/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Diária do motorista/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Cadastrar Motorista/i })).toBeInTheDocument()
  })

  test("mostra toast de erro ao falhar", async () => {
    mutateAsyncMock.mockRejectedValueOnce(new Error("Erro"))

    render(<DriverRegistrationForm />)
    fireEvent.change(screen.getByPlaceholderText(/Digite o nome completo/i), { target: { value: "Fulano" } })
    fireEvent.change(screen.getByPlaceholderText(/000.000.000-00/i), { target: { value: "123.456.789-09" } })
    fireEvent.change(screen.getByPlaceholderText(/exemplo@email.com/i), { target: { value: "fulano@email.com" } })
    fireEvent.change(screen.getByLabelText(/Custo por motorista/i), { target: { value: "2000" } })
    fireEvent.change(screen.getByLabelText(/Diária do motorista/i), { target: { value: "150" } })

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar Motorista/i }))

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({
        description: "Falha ao cadastrar motorista"
      }))
    })
  })

  test("desabilita botão durante submissão", async () => {
    let resolveMutate: Function
    mutateAsyncMock.mockImplementation(() => new Promise(res => { resolveMutate = res }))

    render(<DriverRegistrationForm />)
    fireEvent.change(screen.getByPlaceholderText(/Digite o nome completo/i), { target: { value: "Fulano" } })
    fireEvent.change(screen.getByPlaceholderText(/000.000.000-00/i), { target: { value: "123.456.789-09" } })
    fireEvent.change(screen.getByPlaceholderText(/exemplo@email.com/i), { target: { value: "fulano@email.com" } })
    fireEvent.change(screen.getByLabelText(/Custo por motorista/i), { target: { value: "2000" } })
    fireEvent.change(screen.getByLabelText(/Diária do motorista/i), { target: { value: "150" } })

    const button = screen.getByRole("button", { name: /Cadastrar Motorista/i })
    fireEvent.click(button)
    expect(button).toBeDisabled()

    resolveMutate!()
    await waitFor(() => expect(button).not.toBeDisabled())
  })
})
