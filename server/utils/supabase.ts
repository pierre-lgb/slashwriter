import { createClient, Session } from "@supabase/supabase-js"

export const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: false
        }
    }
)

// https://github.com/supabase/auth-helpers/blob/main/packages/shared/src/utils/cookies.ts

const decodeBase64URL = (value: string): string => {
    try {
        // atob is present in all browsers and nodejs >= 16
        // but if it is not it will throw a ReferenceError in which case we can try to use Buffer
        // replace are here to convert the Base64-URL into Base64 which is what atob supports
        // replace with //g regex acts like replaceAll
        // Decoding base64 to UTF8 see https://stackoverflow.com/a/30106551/17622044
        return decodeURIComponent(
            atob(value.replace(/[-]/g, "+").replace(/[_]/g, "/"))
                .split("")
                .map(
                    (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join("")
        )
    } catch (e) {
        if (e instanceof ReferenceError) {
            // running on nodejs < 16
            // Buffer supports Base64-URL transparently
            return Buffer.from(value, "base64").toString("utf-8")
        } else {
            throw e
        }
    }
}

export const parseSupabaseCookie = (cookie: string): Partial<Session> => {
    if (!cookie) {
        return null
    }

    try {
        const session = JSON.parse(cookie)
        if (!session) {
            return null
        }

        const [_header, payloadStr, _signature] = session[0].split(".")
        const payload = decodeBase64URL(payloadStr)

        const { exp, sub, ...user } = JSON.parse(payload)

        return {
            expires_at: exp,
            expires_in: exp - Math.round(Date.now() / 1000),
            token_type: "bearer",
            access_token: session[0],
            refresh_token: session[1],
            provider_token: session[2],
            provider_refresh_token: session[3],
            user: {
                id: sub,
                ...user
            }
        }
    } catch (err) {
        console.warn("Failed to parse cookie string:", err)
        return null
    }
}

export const supabaseClientWithAuth = (session: Partial<Session>) => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            auth: {
                detectSessionInUrl: false,
                autoRefreshToken: false,
                storageKey: "supabase-auth-token",
                storage: {
                    getItem() {
                        return JSON.stringify(session)
                    },
                    setItem() {},
                    removeItem() {}
                }
            }
        }
    )
}
