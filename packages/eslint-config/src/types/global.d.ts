/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  /**
   * Extracts all possible keys from a union type.
   *
   * @example
   * ```ts
   * type BasicUser = { id: number; name: string };
   * type PremiumUser = { id: number; maxProjects: number };
   * type Keys = ValidKeys<BasicUser | PremiumUser>; // "id" | "name" | "maxProjects"
   * ```
   */
  type ValidKeys<T> = T extends any ? keyof T : never;

  /**
   * Helper that enables `DistributiveOmit` to work with constrained generics.
   *
   * What is a constrained generic?
   *
   * It is a generic where the parameter must satisfy a specific shape via
   * `extends`. Note: `extends` in generics is NOT inheritance, it is a
   * constraint. It tells TypeScript: "T must have at least all fields of
   * Base, but may have additional ones".
   *
   * @example
   * ```ts
   * // T can be any type (unconstrained)
   * type Unrestricted<T> = { data: T };
   *
   * // T is required to have id and name (constrained)
   * // This is NOT inheritance, only a structural requirement
   * type Restricted<T extends { id: number; name: string }> = { data: T };
   *
   * // Analogy: extends in interfaces vs extends in generics
   * interface Base { id: number }
   * interface Child extends Base { name: string } // This is inheritance
   *
   * function process<T extends Base>(item: T) {} // This is a constraint
   * ```
   *
   * Why do we need the C parameter?
   *
   * When we write `T extends Base`, TypeScript knows that T has all fields of
   * Base. But when working with union types, TypeScript does not automatically
   * add those keys into `ValidKeys<T>`.
   *
   * The C parameter lets us explicitly say: "allow removing keys of Base,
   * because T extends Base, so those keys definitely exist in T".
   *
   * @example
   * ```ts
   * type BaseTariff = { id: number; price: number };
   *
   * // Without C — error: TypeScript does not see 'price' in the union T
   * type Bad<T extends BaseTariff> = DistributiveOmit<T, 'price'>;
   *
   * // With C — works: we explicitly allow removing keys of BaseTariff
   * type Good<T extends BaseTariff> = DistributiveOmit<T, 'price', BaseTariff>;
   * ```
   */
  type ConstraintKeys<C> = C extends never
    ? never
    : C extends Record<string, any>
      ? keyof C
      : never;

  /**
   * Improved Omit with three advantages:
   *
   * 1. Typo protection: cannot remove a non-existent key.
   * 2. Works with union types: applied to each variant individually.
   * 3. Supports constrained generics: can remove keys of a base type.
   *
   * Problem 1: the built-in Omit silently accepts typos.
   *
   * @example
   * ```ts
   * type User = { id: number; name: string; email: string };
   *
   * // Built-in Omit — no error, even though 'emial' is a typo
   * type Bad = Omit<User, 'emial'>; // { id: number; name: string; email: string }
   *
   * // DistributiveOmit — compile error
   * type Good = DistributiveOmit<User, 'emial'>; // Error: 'emial' does not exist
   * ```
   *
   * Problem 2: the built-in Omit breaks union types.
   *
   * Why is the empty `{}` type dangerous?
   *
   * In TypeScript `{}` means "any value except null and undefined". This leads to:
   * - loss of all structural information about the type,
   * - no IDE autocomplete,
   * - impossible to find usages during refactoring,
   * - runtime errors that TypeScript cannot catch.
   *
   * Why does the built-in Omit return `{}` for unions?
   *
   * Mechanism:
   * 1. `keyof (A | B)` returns only shared keys (the intersection).
   * 2. If we remove all shared keys, only variant-specific keys remain.
   * 3. Pick cannot select variant-specific keys from a union.
   * 4. Result: `{}`.
   *
   * @example
   * ```ts
   * type AdminUser = { role: 'admin'; deleteUser: (id: number) => void };
   * type RegularUser = { role: 'user'; viewProfile: () => void };
   *
   * // Remove the 'role' field.
   * // Built-in Omit — returns {}, all type info is lost
   * type BadUserPermissions = Omit<AdminUser | RegularUser, 'role'>; // {}
   *
   * // DANGER 1: anything can be assigned, no compile error
   * const perms1: BadUserPermissions = "hello";
   * const perms2: BadUserPermissions = 123;
   * const perms3: BadUserPermissions = { deleteUser: () => {} };
   *
   * // DANGER 2: no structural information
   * // No autocomplete, no type checking
   * perms3.deleteUser; // Property 'deleteUser' does not exist on type '{}'
   *
   * // DANGER 3: functions accept wrong data
   * function checkPermissions(p: BadUserPermissions) {
   *   // No hints on p, because the type is {}
   * }
   *
   * // Compiles, but may throw at runtime
   * checkPermissions("wrong data");
   *
   * // DistributiveOmit — applies Omit to each variant individually
   * type GoodUserPermissions = DistributiveOmit<AdminUser | RegularUser, 'role'>;
   * // { deleteUser: (id: number) => void } | { viewProfile: () => void }
   *
   * const perms4: GoodUserPermissions = "hello"; // compile error, as expected
   * const perms5: GoodUserPermissions = { deleteUser: (id) => {} }; // OK
   * perms5.deleteUser(1); // autocomplete and type checking work
   * ```
   *
   * Problem 3: constrained generics require the third parameter.
   *
   * See `ConstraintKeys` above for details. In short: when `T extends Base`,
   * pass Base as the third parameter to allow removing keys of the base type.
   *
   * @example
   * ```tsx
   * type Overflow = {
   *   listContainer?: HTMLElement | null;
   *   onListStyleCalculating?: (el: HTMLElement | null) => React.CSSProperties;
   * };
   *
   * // HOC removes listContainer from props since it provides one itself
   * const withOverflow = <T extends Overflow>(
   *   Component: React.ComponentType<T>
   * ): FC<DistributiveOmit<T, 'listContainer', Overflow>> => {
   *   return (props) => (
   *     <Component {...props} listContainer={document.body} />
   *   );
   * };
   * ```
   *
   * @example
   * ```ts
   * interface UserBase {
   *   id: number;
   *   internalId: string; // service field for API
   * }
   *
   * // Without the third parameter — error
   * type Bad<T extends UserBase> = DistributiveOmit<T, 'internalId'>;
   *
   * // With the third parameter — works
   * type Good<T extends UserBase> = DistributiveOmit<T, 'internalId', UserBase>;
   *
   * function toApiResponse<T extends UserBase>(user: T): Good<T> {
   *   const { internalId, ...rest } = user;
   *   return rest as Good<T>;
   * }
   * ```
   *
   * @see https://www.youtube.com/watch?v=J4vJ-wO6Sl0
   * @see https://tkdodo.eu/blog/omit-for-discriminated-unions-in-type-script
   *
   * @template T - source type
   * @template K - keys to remove
   * @template C - base type for constrained generics (default: never)
   */
  type DistributiveOmit<
    T,
    K extends ValidKeys<T> | ConstraintKeys<C>,
    C = never,
  > = T extends any ? Omit<T, K> : never;
}

export {};
