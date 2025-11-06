import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter, useNavigate, useLocation } from "react-router-dom"
import ResetPasswordForm from "./index"
import { useResetPassword } from "@/services/hooks/useUsers"

jest.mock("@/services/hooks/useUsers")
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}))

describe("ResetPasswordForm", () => {
  const mockResetPassword = jest.fn()
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
      ; (useNavigate as jest.Mock).mockReturnValue(mockNavigate)
      ; (useLocation as jest.Mock).mockReturnValue({
        search: "?email=test@example.com",
      })
      ; (useResetPassword as jest.Mock).mockReturnValue({
        mutate: mockResetPassword,
        isPending: false,
        isSuccess: false,
      })
  })

  function renderForm() {
    return render(
      <MemoryRouter>
        <ResetPasswordForm />
      </MemoryRouter>
    )
  }

  test("renderiza os campos principais", () => {
    renderForm()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Código")).toBeInTheDocument()
    expect(screen.getByLabelText("Nova senha")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Redefinir senha/i })).toBeInTheDocument()
  })

  test("mostra erro se campos estão vazios", () => {
    renderForm()
    fireEvent.click(screen.getByRole("button", { name: /Redefinir senha/i }))
    expect(screen.getByText("Preencha todos os campos.")).toBeInTheDocument()
    expect(mockResetPassword).not.toHaveBeenCalled()
  })

  test("envia corretamente e navega no sucesso", async () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      mutate: (data: any, { onSuccess }: any) => onSuccess(),
      isPending: false,
      isSuccess: false,
    })

    renderForm()

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText("Código"), {
      target: { value: "123456" },
    })
    fireEvent.change(screen.getByLabelText("Nova senha"), {
      target: { value: "novaSenha123" },
    })

    fireEvent.click(screen.getByRole("button", { name: /Redefinir senha/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login")
    })
  })
})
