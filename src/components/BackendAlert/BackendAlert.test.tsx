import { render, screen } from "@testing-library/react"
import BackendAlert from "."

describe("BackendAlert Component", () => {
  it("renderiza corretamente a mensagem de sucesso", () => {
    render(<BackendAlert status="success" message="Operação concluída com sucesso" />)

    expect(screen.getByText("Sucesso")).toBeInTheDocument()
    expect(screen.getByText("Operação concluída com sucesso")).toBeInTheDocument()
  })

  it("renderiza corretamente a mensagem de erro", () => {
    render(<BackendAlert status="error" message="Algo deu errado" />)

    expect(screen.getByText("Erro")).toBeInTheDocument()
    expect(screen.getByText("Algo deu errado")).toBeInTheDocument()
  })
})
