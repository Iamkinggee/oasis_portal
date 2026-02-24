// // app/page.tsx
// import Link from "next/link";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
//       <div className="max-w-3xl">
//         <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
//           Welcome to <span className="text-red-600">Oasis</span>
//         </h1>
        
//         <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto">
//           A private portal. Exclusive. Seductive. Only for those who know the way in.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-6 justify-center">
//           <Link
//             href="/login"
//             className="
//               px-10 py-5 bg-black border border-zinc-700 
//               hover:border-red-600 text-white font-medium
//               rounded-xl transition-all duration-300
//               uppercase tracking-wider text-sm
//             "
//           >
//             Enter the Portal
//           </Link>

//           <Link
//             href="/signup"
//             className="
//               px-10 py-5 bg-zinc-900 border border-zinc-800 
//               hover:bg-zinc-800 text-zinc-300 hover:text-white
//               rounded-xl transition-all duration-300
//               uppercase tracking-wider text-sm
//             "
//           >
//             Request Access
//           </Link>
//         </div>

//         <p className="mt-16 text-zinc-600 text-sm">
//           © {new Date().getFullYear()} Oasis Collective • All rights reserved
//         </p>
//       </div>
//     </div>
//   );
// }





// app/page.tsx
import { redirect } from 'next/navigation';
import { RedirectType } from 'next/navigation';  // optional but explicit

export default function Home() {
  redirect('/login', RedirectType.replace);

  return null;
}