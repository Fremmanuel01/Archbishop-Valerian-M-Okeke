// Shared form-state types and constants used by the Connect server actions
// and the client-side form components. Kept in its own file (not "use server")
// because a server-actions file may only export async functions — exporting
// a type or a const from it crashes the production build with
// `A "use server" file can only export async functions, found object.`

export type FormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export const initialFormState: FormState = { status: "idle" };
