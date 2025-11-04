import { render, screen, fireEvent, waitFor } from "@testing-library/react"

import { useClient, useUpdateClient, useDeleteClient } from "@/services/hooks/useClient"
import { useToast } from "@/hooks/use-toast"
import { ClientDataGrid } from "."

jest.mock("@/services/hooks/useClient")
jest.mock("@/hooks/use-toast")

const mutateAsyncMock = jest.fn()
const toastMock = jest.fn()

  ; (useClient as jest.Mock).mockReturnValue({
    data: [
      { id: "1", name: "João", telephone: "123456789", email: "joao@email.com" },
      { id: "2", name: "Maria", telephone: "987654321", email: "maria@email.com" }
    ]
  })

  ; (useUpdateClient as jest.Mock).mockReturnValue({ mutateAsync: mutateAsyncMock })
  ; (useDeleteClient as jest.Mock).mockReturnValue({ mutateAsync: mutateAsyncMock })
  ; (useToast as jest.Mock).mockReturnValue({ toast: toastMock })

describe("ClientDataGrid", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renderiza clientes na tabela", () => {
    render(<ClientDataGrid />)
    const joaoElements = screen.getAllByText("João")
    const mariaElements = screen.getAllByText("Maria")
    expect(joaoElements[0]).toBeInTheDocument()
    expect(mariaElements[0]).toBeInTheDocument()
  })

  test("inicia edição de cliente", () => {
    render(<ClientDataGrid />)
    fireEvent.click(screen.getAllByText(/Editar/i)[0])
    const inputs = screen.getAllByDisplayValue("João")
    expect(inputs[0]).toBeInTheDocument()
  })

  test("cancela edição", () => {
    render(<ClientDataGrid />)
    fireEvent.click(screen.getAllByText(/Editar/i)[0])
    fireEvent.click(screen.getByText(/Cancelar/i))
    const joaoElements = screen.getAllByText("João")
    expect(joaoElements[0]).toBeInTheDocument()
  })

  test("salva edição de cliente", async () => {
    render(<ClientDataGrid />)
    fireEvent.click(screen.getAllByText(/Editar/i)[0])
    const input = screen.getAllByDisplayValue("João")[0]
    fireEvent.change(input, { target: { value: "João Editado" } })
    fireEvent.click(screen.getByText(/Salvar/i))

    await waitFor(() =>
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        id: "1",
        data: expect.objectContaining({ name: "João Editado" })
      })
    )
    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({
      title: "Sucesso"
    }))
  })

  test("deleta cliente", async () => {
    render(<ClientDataGrid />)
    fireEvent.click(screen.getAllByText(/Excluir/i)[0])
    await waitFor(() => expect(mutateAsyncMock).toHaveBeenCalledWith("1"))
    expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({
      title: "Sucesso"
    }))
  })

  test("mostra mensagem quando não há clientes", () => {
    ; (useClient as jest.Mock).mockReturnValueOnce({ data: [] })
    render(<ClientDataGrid />)
    expect(screen.getByText(/Nenhum cliente cadastrado/i)).toBeInTheDocument()
  })
})
