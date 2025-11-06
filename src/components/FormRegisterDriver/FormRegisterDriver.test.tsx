import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { DriverRegistrationForm } from "."
import { useCreateDriver } from "@/services/hooks/useDriver"

jest.mock("@/services/hooks/useDriver")

const mutateAsyncMock = jest.fn()

  ; (useCreateDriver as jest.Mock).mockReturnValue({
    mutateAsync: mutateAsyncMock,
  })

describe("DriverRegistrationForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renderiza todos os campos do formulário", () => {
    render(<DriverRegistrationForm />)

    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/custo por motorista/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/diária do motorista/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /cadastrar motorista/i })).toBeInTheDocument()
  })

  test("mostra erro se nome estiver vazio", async () => {
    render(<DriverRegistrationForm />)
    fireEvent.click(screen.getByRole("button", { name: /cadastrar motorista/i }))
    expect(await screen.findByText(/nome é obrigatório/i)).toBeInTheDocument()
    expect(mutateAsyncMock).not.toHaveBeenCalled()
  })

  test("mostra erro se CPF for inválido", async () => {
    render(<DriverRegistrationForm />)

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "João" } })
    fireEvent.change(screen.getByLabelText(/cpf/i), { target: { value: "123" } })

    fireEvent.click(screen.getByRole("button", { name: /cadastrar motorista/i }))

    expect(await screen.findByText(/cpf inválido/i)).toBeInTheDocument()
    expect(mutateAsyncMock).not.toHaveBeenCalled()
  })

  test("mostra erro se custo do motorista for zero", async () => {
    render(<DriverRegistrationForm />)

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "Ana" } })
    fireEvent.change(screen.getByLabelText(/cpf/i), { target: { value: "12345678901" } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "ana@email.com" } })

    fireEvent.click(screen.getByRole("button", { name: /cadastrar motorista/i }))

    expect(await screen.findByText(/custo do motorista obrigatório/i)).toBeInTheDocument()
    expect(mutateAsyncMock).not.toHaveBeenCalled()
  })

  test("mostra erro se custo diário for zero", async () => {
    render(<DriverRegistrationForm />)

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "Pedro" } })
    fireEvent.change(screen.getByLabelText(/cpf/i), { target: { value: "12345678901" } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "pedro@email.com" } })
    fireEvent.change(screen.getByLabelText(/custo por motorista/i), { target: { value: "2000" } })

    fireEvent.click(screen.getByRole("button", { name: /cadastrar motorista/i }))

    expect(await screen.findByText(/custo por diária do motorista obrigatório/i)).toBeInTheDocument()
    expect(mutateAsyncMock).not.toHaveBeenCalled()
  })

  test("envia formulário com sucesso", async () => {
    mutateAsyncMock.mockResolvedValueOnce({})

    render(<DriverRegistrationForm />)

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "Carlos" } })
    fireEvent.change(screen.getByLabelText(/cpf/i), { target: { value: "12345678901" } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "carlos@email.com" } })
    fireEvent.change(screen.getByLabelText(/custo por motorista/i), { target: { value: "1500" } })
    fireEvent.change(screen.getByLabelText(/diária do motorista/i), { target: { value: "200" } })

    fireEvent.click(screen.getByRole("button", { name: /cadastrar motorista/i }))

    await waitFor(() =>
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        name: "Carlos",
        cpf: "123.456.789-01",
        email: "carlos@email.com",
        driverCost: "1500",
        dailyPriceDriver: "200",
      })
    )

    expect(await screen.findByText(/motorista cadastrado com sucesso/i)).toBeInTheDocument()
  })

  test("mostra erro se falhar no backend", async () => {
    mutateAsyncMock.mockRejectedValueOnce(new Error("erro"))

    render(<DriverRegistrationForm />)

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "Paulo" } })
    fireEvent.change(screen.getByLabelText(/cpf/i), { target: { value: "12345678901" } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "paulo@email.com" } })
    fireEvent.change(screen.getByLabelText(/custo por motorista/i), { target: { value: "1000" } })
    fireEvent.change(screen.getByLabelText(/diária do motorista/i), { target: { value: "150" } })

    fireEvent.click(screen.getByRole("button", { name: /cadastrar motorista/i }))

    expect(await screen.findByText(/falha ao cadastrar motorista/i)).toBeInTheDocument()
  })
})
