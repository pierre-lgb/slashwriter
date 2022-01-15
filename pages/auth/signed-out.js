import Router from 'next/router'
import React, { useEffect } from 'react'

export default function signedOut() {
    useEffect(() => {
        const timeout = setTimeout(() => Router.push("/"), 2000)
        return () => {
            clearTimeout(timeout)
        }
    }, [])

    return (
        <div style={{
            width: 350,
            margin: "250px auto 20px auto",
            textAlign: "center",
            color: "var(--color-n900)"
        }}>
            <img src="/assets/logo.svg" alt="Logo" />
            <h1 style={{
                fontSize: 32,
                fontWeight: 600
            }}>Vous avez bien été déconnecté</h1>
            <p style={{ fontSize: 18, color: "var(--color-n600)" }}>Redirection...</p>
        </div>
    )
}
