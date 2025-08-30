// src/lib/validators/auth.ts
import { z } from "zod";

/** Email con validación decente */
export const emailSchema = z
  .string()
  .trim()
  .min(1, "El correo es obligatorio")
  .email("Correo inválido");

/** Contraseña mínima razonable.
 * Sube los requisitos cuando te canses de contraseñas «12345678».
 */
export const passwordSchema = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .max(72, "Demasiado larga");

/** Login */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "La contraseña es obligatoria"),
});

/** Registro */
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: z.string().trim().min(1, "Tu nombre es obligatorio"),
});

/** Cambio de contraseña */
export const changePasswordSchema = z.object({
  new_password: passwordSchema,
});

/** Tipos derivados para formularios (útiles con react-hook-form) */
export type SignInForm = z.infer<typeof signInSchema>;
export type SignUpForm = z.infer<typeof signUpSchema>;
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
