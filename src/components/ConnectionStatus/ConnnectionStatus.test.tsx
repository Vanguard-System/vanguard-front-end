import { render, screen, waitFor } from "@testing-library/react";
import ConnectionStatus from ".";

describe("ConnectionStatus", () => {
  let originalNavigator: any;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    originalNavigator = Object.getOwnPropertyDescriptor(window, "navigator");

    global.fetch = jest.fn();

    fetchMock = jest.spyOn(global as any, "fetch");
  });

  afterEach(() => {
    if (originalNavigator) {
      Object.defineProperty(window, "navigator", originalNavigator);
    }

    jest.restoreAllMocks();
  });

  function setNavigatorOnLine(value: boolean) {
    Object.defineProperty(window, "navigator", {
      value: { onLine: value },
      configurable: true,
    });
  }

  it("não renderiza nada quando online", async () => {
    setNavigatorOnLine(true);

    fetchMock.mockResolvedValue({ ok: true });

    render(<ConnectionStatus />);

    await waitFor(() =>
      expect(
        screen.queryByText(/Você está sem conexão/)
      ).toBeNull()
    );
  });

  it("renderiza o banner quando offline", async () => {
    setNavigatorOnLine(false);

    fetchMock.mockRejectedValue(new Error("network error"));

    render(<ConnectionStatus />);

    await waitFor(() =>
      expect(
        screen.getByText(/Você está sem conexão/)
      ).toBeInTheDocument()
    );
  });
});
