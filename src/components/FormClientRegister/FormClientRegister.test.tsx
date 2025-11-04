import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { FormClientRegister } from "."

const toastMock = jest.fn()
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}))

const mutateAsyncMock = jest.fn()
jest.mock("@/services/hooks/useClient", () => ({
  useCreateClient: () => ({
    mutateAsync: mutateAsyncMock,
  }),
}))

describe("FormClientRegister", () => {
  beforeEach(() => {
    toastMock.mockClear()
    mutateAsyncMock.mockClear()
  })

  test("renderiza os campos e botão corretamente", () => {
    render(<FormClientRegister />)

    expect(screen.getByPlaceholderText(/Digite o nome completo/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/exemplo@email.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/\(DDD\) 999999999/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Cadastrar Cliente/i })).toBeInTheDocument()
  })

  test("chama mutateAsync e mostra toast de sucesso", async () => {
    mutateAsyncMock.mockResolvedValueOnce({})

    render(<FormClientRegister />)
    fireEvent.change(screen.getByPlaceholderText(/Digite o nome completo/i), { target: { value: "Fulano" } })
    fireEvent.change(screen.getByPlaceholderText(/\(DDD\) 999999999/i), { target: { value: "(11) 999999999" } })
    fireEvent.change(screen.getByPlaceholderText(/exemplo@email.com/i), { target: { value: "fulano@email.com" } })

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar Cliente/i }))

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        name: "Fulano",
        telephone: "(11) 999999999",
        email: "fulano@email.com",
      })
      expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({
        description: "Cliente cadastrado com sucesso"
      }))
    })
  })

  test("mostra toast de erro ao falhar", async () => {
    mutateAsyncMock.mockRejectedValueOnce(new Error("Erro"))

    render(<FormClientRegister />)
    fireEvent.change(screen.getByPlaceholderText(/Digite o nome completo/i), { target: { value: "Fulano" } })
    fireEvent.change(screen.getByPlaceholderText(/\(DDD\) 999999999/i), { target: { value: "(11) 999999999" } })
    fireEvent.change(screen.getByPlaceholderText(/exemplo@email.com/i), { target: { value: "fulano@email.com" } })

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar Cliente/i }))

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({
        description: "Falha ao cadastrar cliente"
      }))
    })
  })

  test("desabilita botão durante submissão", async () => {
    let resolveMutate: Function
    mutateAsyncMock.mockImplementation(
      () => new Promise(res => { resolveMutate = res })
    )

    render(<FormClientRegister />)
    fireEvent.change(screen.getByPlaceholderText(/Digite o nome completo/i), { target: { value: "Fulano" } })
    fireEvent.change(screen.getByPlaceholderText(/\(DDD\) 999999999/i), { target: { value: "(11) 999999999" } })
    fireEvent.change(screen.getByPlaceholderText(/exemplo@email.com/i), { target: { value: "fulano@email.com" } })

    const button = screen.getByRole("button", { name: /Cadastrar Cliente/i })
    fireEvent.click(button)

    expect(button).toBeDisabled()

    resolveMutate!()
    await waitFor(() => expect(button).not.toBeDisabled())
  })
})
