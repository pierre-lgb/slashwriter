export default async (filter) => {
    const exists = await fetch("/api/auth/check-exists", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filter)
    })
        .then(res => res.json())
        .then(({ exists }) => exists)

    return exists
}