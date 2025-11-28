// ConnectionStatus.test.tsx
import { render, screen } from "@testing-library/react";
import ConnectionStatus from ".";

describe("ConnectionStatus", () => {
  let originalNavigator: any;

  beforeAll(() => {
    // Salvar navigator original para restaurar depois
    originalNavigator = Object.getOwnPropertyDescriptor(window, "navigator");
  });

  afterAll(() => {
    // Restaurar navigator original
    Object.defineProperty(window, "navigator", originalNavigator);
  });

  function setNavigatorOnLine(value: boolean) {
    Object.defineProperty(window, "navigator", {
      value: { onLine: value },
      configurable: true,
    });
  }

  it("não renderiza nada quando online", () => {
    setNavigatorOnLine(true);
    render(<ConnectionStatus />);
    expect(screen.queryByText(/Você está sem conexão/)).toBeNull();
  });

  it("renderiza o banner quando offline", () => {
    setNavigatorOnLine(false);
    render(<ConnectionStatus />);
    expect(screen.getByText(/Você está sem conexão/)).toBeInTheDocument();
  });
});
