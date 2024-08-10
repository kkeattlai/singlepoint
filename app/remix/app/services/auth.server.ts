import { z } from "zod";
import { DateTime } from "luxon";
import { Role } from "@prisma/client";
import { createCookie } from "@remix-run/node";

import { prisma } from "./db.server";

const schema = z.object({
    id: z.string().uuid()
});

const userSchema = z.object({
    id: z.string(),
    email: z.string(),
    fullname: z.string(),
    mobile: z.string(),
    isBlocked: z.boolean(),
    isEmailVerified: z.boolean(),
    isMobileVerified: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
}).transform(user => {
    const { isBlocked, isEmailVerified, isMobileVerified, createdAt, updatedAt, ...rest } = user;

    return {
        ...rest,
        status: {
            isBlocked, isEmailVerified, isMobileVerified, createdAt, updatedAt
        }
    };
}).pipe(
    z.object({
        id: z.string(),
        email: z.string(),
        fullname: z.string(),
        mobile: z.string(),
        status: z.object({
            isBlocked: z.boolean(),
            isEmailVerified: z.boolean(),
            isMobileVerified: z.boolean(),
            createdAt: z.date(),
            updatedAt: z.date(),
        })
    })
);

const authTokenCookie = createCookie("__auth", {
    httpOnly: true,
    secure: true,
    secrets: [
        "2v5XGvm1LJaRmp]&k(xMR!GJ#p/z,u{$+N%BM0f7m$YW.!K{[RWxYRRGrR]V;aufpUY###C1)%VfqzWj(S(JXtF9m[zhHX@]?4b=",
        "6rBP+rYSQX1kq*w(:UCAukR4btiHPU:#u&CUh4/[B?E/pq4WP[/T*E3,SMuBV?G2v@W0=wXVWnqu/UyCbU?_7B)t:]xNXRg3YNF[",
        "@cdN0%,eP&tH&0({8P,iiiEi_i,Yr6QZR}J_?4&U!xzj#;GUg%!bW+9kPakKE-$*(&d4QD-YHf09@+HE:MXg#f[F#%}KK6p;)q.t",
        "jV=aeN}U_&BuH(#KQBPg7x{-hngiBvrak](:__8cS,jJFDHWSJHJ)ErVN@kjR6E1Gy7VvJjR?:FzD8PEXifH_kM{jr(:F_CE6x-Z",
        "Z!{BaEvSXT5!Xyn*UXHjh=aZC2N*0]pFX!STb1cf3Z&7@y5ZK8TCp@!ep5i{r:/v:#HKz?r?iij.04.R.CnqfV[dnWU,gy[Vt#@a",
        "4j;16i:&BHN[A23wQ+4L@GZbUCw;;Z5Y*6?gAeRK&wC7ph@.-+j+QGM-YK1Ln(MH+rNr]3@#M!D7)/piUXr8a*)4#uxCmm9V_N7-",
        "gW#5WGaAxYMm%)FJ*X#+eXvhT]tnpkQ(y%}VMBUJT/MqTtLdfa{,X:(yN?nwxn)i&z=F1;J(4T2N6$!6A;XP/K19b7Y+bu/La1Gf",
        "aCN(Y1KdxrmP3R1N;{euK[R6{=i)BS=e=[025,ytNzL.6iKJB1?FXhz?zHmRT9,M]%}uia:+JVjy-XC:{.67z_XHj#&wU;]!47#F",
        "T}+@U2a.ge-W4$Z;]%6HT.DK5?p@pU)TFa-8?;4rek.2.-)5-.7:BA5:)Cg}bjaGA#4mmz%2PEB,k,P;9nx-*-QXu5wJfg@Z-Pn{",
        "(hnGq@WQjBC$x]{F?G9DpaYbLYQ6fG;1+70UBT(m;Z6.dTaC6E?rir!=e+!M#k&P/W4FB?Dz?2&}#-(Y=hXU3QYL:A)QH_+j,cWL"
    ]
});

export const useAuthToken = {
    serialize: async (userId: string): Promise<[ string, string ]> => {
        const session = await prisma.session.create({
            data: {
                userId,
                expiredAt: DateTime.now().plus({ months: 1 }).toJSDate()
            }
        });

        return [ "Set-Cookie", await authTokenCookie.serialize({ id: session.id }) ];
    },
    parse: async (request: Request) => {
        const parsedAuthToken = schema.safeParse(await authTokenCookie.parse(request.headers.get("Cookie")));

        if (parsedAuthToken.error) return null;

        const { id } = parsedAuthToken.data;

        const session = await prisma.session.findFirst({
            where: { id, expiredAt: { gt: DateTime.now().toJSDate() } },
        });
        
        if (!session) return null;
        
        const parsedUser = userSchema.safeParse(
            await prisma.user.findFirst({
                where: { id: session.userId ?? "0" }
            })
        );

        if (parsedUser.error) return null;

        return parsedUser.data;
    }
};