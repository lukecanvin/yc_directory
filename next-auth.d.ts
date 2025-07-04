import "next-auth/jwt";
import "next-auth";

declare module "next-auth" {
  interface Profile {
    id?: string;
    login?: string;
    bio?: string;
  }

  /**
   * The shape of the session object returned by `auth()`.
   */
  interface Session {
    id?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * The shape of the JWT token returned by the `jwt()` callback.
   */
  interface JWT {
    id?: string;
  }
}
