export interface RestrictedSyntaxSelector {
  /**
   * ESLint AST selector string.
   */
  selector: string;
  /**
   * Message shown when the selector matches.
   */
  message: string;
}
