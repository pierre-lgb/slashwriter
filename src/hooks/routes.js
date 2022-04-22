// import { useRouter } from "next/router";
// import { useState } from "react";
// import { useEffect } from "react";
// import { useAuth } from "../firebase/auth";

// // Public routes
// export function withPublic(Component) {
//     return (props) => {
//         const [pending, setPending] = useState(true);
//         const { user } = useAuth();
//         const router = useRouter();

//         useEffect(() => {
//             setPending(false);
//             if (user) {
//                 router.replace("/spaces");
//             }
//         }, [user]);

//         return pending ? null : <Component {...props} />;
//     };
// }

// // Private routes
// export function withProtected(Component) {
//     return (props) => {
//         const [pending, setPending] = useState(true);
//         const { user } = useAuth();
//         const router = useRouter();

//         useEffect(() => {
//             setPending(false);
//             if (user === null) {
//                 router.replace("/auth/signin");
//             }
//         }, [user]);

//         return pending ? null : <Component {...props} />;
//     };
// }
