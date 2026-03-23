import { AuditAction } from "@prisma/client";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";

async function logLoginAttempt(email: string, succeeded: boolean, userId?: string) {
  try {
    await prisma.auditLog.create({
      data: {
        action: succeeded ? AuditAction.LOGIN_SUCCESS : AuditAction.LOGIN_FAILURE,
        entityType: "AUTH",
        entityId: userId,
        summary: succeeded
          ? `Inicio de sesion correcto para ${email}`
          : `Intento fallido de inicio de sesion para ${email}`,
        actorId: userId,
        changes: {
          email,
        },
      },
    });
  } catch {
    return;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.isActive) {
          await logLoginAttempt(email, false, user?.id);
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatches) {
          await logLoginAttempt(email, false, user.id);
          return null;
        }

        await logLoginAttempt(email, true, user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id =
          (typeof token.id === "string" && token.id) ||
          (typeof token.sub === "string" && token.sub) ||
          session.user.id;
      }

      return session;
    },
  },
});
