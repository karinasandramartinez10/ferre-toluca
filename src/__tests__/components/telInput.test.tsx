import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SnackbarProvider } from "notistack";
import ContactPage from "../../app/(main)/contact/ContactPage";
import { submitContactRequest } from "../../api/contactRequests";

vi.mock("../../api/contactRequests", () => ({
  submitContactRequest: vi.fn().mockResolvedValue({}),
}));

const renderPage = () =>
  render(
    <SnackbarProvider>
      <ContactPage />
    </SnackbarProvider>
  );

const fillRequiredFields = async (user) => {
  await user.type(screen.getByLabelText("Nombre"), "Juan");
  await user.type(screen.getByLabelText("Apellido"), "Perez");
  await user.type(screen.getByLabelText("Correo electrónico"), "juan@example.com");
};

const submit = async (user) => {
  await user.click(screen.getByRole("button", { name: /Enviar/i }));
};

describe("Formulario de contacto: teléfono", () => {
  beforeEach(() => {
    vi.mocked(submitContactRequest).mockClear();
  });

  it("manda el teléfono como E.164 sin espacios", async () => {
    const user = userEvent.setup();
    renderPage();
    await fillRequiredFields(user);
    await user.type(screen.getByLabelText(/Teléfono/i), "5512345678");
    await submit(user);
    await waitFor(() => expect(submitContactRequest).toHaveBeenCalled());
    expect(vi.mocked(submitContactRequest).mock.calls[0][0].phoneNumber).toBe("+525512345678");
  });

  it("no ofrece selector de país", () => {
    const { container } = renderPage();
    expect(container.querySelector("button.MuiTelInput-IconButton")).toBeNull();
  });

  // forceCallingCode deja "+52" en el input al borrar, no "". Sin el transform del
  // schema, un teléfono opcional borrado bloquearía el envío del formulario.
  it("permite enviar tras escribir y borrar el teléfono opcional", async () => {
    const user = userEvent.setup();
    renderPage();
    await fillRequiredFields(user);
    const tel = screen.getByLabelText(/Teléfono/i);
    await user.type(tel, "5512345678");
    await user.clear(tel);
    await submit(user);
    await waitFor(() => expect(submitContactRequest).toHaveBeenCalled());
    expect(vi.mocked(submitContactRequest).mock.calls[0][0].phoneNumber).toBeUndefined();
  });

  it("bloquea el envío con un teléfono que no es mexicano", async () => {
    const user = userEvent.setup();
    renderPage();
    await fillRequiredFields(user);
    await user.type(screen.getByLabelText(/Teléfono/i), "12345");
    await waitFor(() => expect(screen.getByText("El teléfono no es válido")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /Enviar/i })).toBeDisabled();
  });
});
