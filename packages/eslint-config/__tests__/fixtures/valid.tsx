interface Props {
  /**
   * Visibility flag.
   */
  isVisible: boolean;
  /**
   * Render the child element instead of the default wrapper.
   */
  asChild?: boolean;
}

export const Widget = (props: Props) => {
  const { isVisible, asChild = false } = props;
  const Comp = asChild ? 'span' : 'div';

  return <Comp>{isVisible ? <span /> : null}</Comp>;
};
