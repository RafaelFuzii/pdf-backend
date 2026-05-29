import { Prisma } from "../../generated/prisma/client";

export type CriarEmpresaPayload = Omit<Prisma.EmpresaUncheckedCreateInput, "usuarioId">;
