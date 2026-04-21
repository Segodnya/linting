interface Props {
  /**
   * Visibility flag.
   */
  isVisible: boolean;
}

export const Widget = (props: Props) => {
  const { isVisible } = props;

  return <div>{isVisible ? <span /> : null}</div>;
};
