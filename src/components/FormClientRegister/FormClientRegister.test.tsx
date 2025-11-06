import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { FormClientRegister } from "."
import { useCreateClient } from "@/services/hooks/useClient"

jest.mock("@/services/hooks/useClient")

const mutateAsyncMock = jest.fn()

  ; (useCreateClient as jest.Mock).mockReturnValue({
    mutateAsync: mutateAsyncMock,
  })

describe("FormClientRegister", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renderiza o formulário com campos básicos", () => {
    render(<FormClientRegister />)
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /cadastrar cliente/i })).toBeInTheDocument()
  })

  test("mostra erro se nome não for preenchido", async () => {
    render(<FormClientRegister />)

    fireEvent.click(screen.getByRole("button", { name: /cadastrar cliente/i }))

    expect(await screen.findByText(/nome é obrigatório/i)).toBeInTheDocument()
    expect(mutateAsyncMock).not.toHaveBeenCalled()
  })

  test("mostra erro se telefone não for preenchido", async () => {
    render(<FormClientRegister />)

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: "Maria" },
    })
    fireEvent.click(screen.getByRole("button", { name: /cadastrar cliente/i }))

    expect(await screen.findByText(/telefone é obrigatório/i)).toBeInTheDocument()
    expect(mutateAsyncMock).not.toHaveBeenCalled()
  })

  test("envia formulário com sucesso", async () => {
    mutateAsyncMock.mockResolvedValueOnce({})

    render(<FormClientRegister />)

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: "Ana Silva" },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "ana@email.com" },
    })
    fireEvent.change(screen.getByLabelText(/telefone/i), {
      target: { value: "(21)988887777" },
    })

    fireEvent.click(screen.getByRole("button", { name: /cadastrar cliente/i }))

    await waitFor(() =>
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        name: "Ana Silva",
        email: "ana@email.com",
        telephone: "(21)988887777",
      })
    )

    expect(await screen.findByText(/cliente cadastrado com sucesso/i)).toBeInTheDocument()
  })

  test("mostra erro se falhar no backend", async () => {
    mutateAsyncMock.mockRejectedValueOnce(new Error("erro"))

    render(<FormClientRegister />)

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: "Pedro" },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "pedro@email.com" },
    })
    fireEvent.change(screen.getByLabelText(/telefone/i), {
      target: { value: "(11)900001111" },
    })

    fireEvent.click(screen.getByRole("button", { name: /cadastrar cliente/i }))

    expect(await screen.findByText(/falha ao cadastrar cliente/i)).toBeInTheDocument()
  })
})
