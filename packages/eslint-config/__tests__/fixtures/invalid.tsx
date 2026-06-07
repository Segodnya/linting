// @prettier-ignore
import { useState, useEffect, useRef, FC } from 'react';

// Error: no-unreachable
function example() {
  return;
  console.log('This is unreachable');
}

// Error: array-callback-return
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map((num) => {
  if (num > 2) {
    return num * 2;
  }
});

// Error: curly
if (true) console.log('No curly braces');

// Error: dot-location
const objDot = { property: 1, class: 'object' };

const donFoo = objDot.property;

// Error: dot-notation
const fooDotNotation = { class: 'CS 101' };

const xDot = fooDotNotation['class'];

// Error: eqeqeq
if (a == b) {
}

// Error: no-alert
alert('This is an alert');

// Error: no-caller
function foo(n) {
  if (n <= 0) {
    return;
  }

  arguments.callee(n - 1);
}

// Error: no-console
console.log('Logging to console');
console.warn('Logging to console');
console.error('Logging to console');

// Error: no-else-return
function check(x) {
  if (x > 10) {
    return 'Big';
  } else {
    return 'Small';
  }
}

// Error: no-empty-function
function empty() {}

// Error: no-eq-null
if (foo == null) {
  // ...
}

// Error: no-eval
(0, eval)('var a = 0');

// Error: no-extend-native
Object.defineProperty(Array.prototype, 'times', { value: 999 });

// Error: no-extra-bind
const fooBind = function () {
  foo();
}.bind(empty);

// Error: no-extra-label
A: while (a) {
  break A;
}

// Error: no-fallthrough
switch (foo) {
  case 1:
    console.log('no break after');

  case 2:
    console.log('falling');
}

// Error: no-floating-decimal
const num = 0.5;

// Error: no-implied-eval
setTimeout("alert('Hi!');", 100);

// Error: no-lone-blocks
{
}

// Error: no-loop-func
for (let i = 0; i < 10; ++i) {
  setTimeout(() => {
    return foo;
  });
}

// Error: no-multi-spaces
const x = 10;

// Error: no-multi-str
const str =
  'This is a string \
that spans multiple lines';

// Error: no-new-func
const func = new Function('return 1');

// Error: no-new-wrappers
const stringObject = new String('Hello world');
const numberObject = new Number(33);
const booleanObject = new Boolean(false);

// For some reason, violating the 2 rules below breaks linting for the rest of the code
// commented out for now

// Error: no-octal
// const octalresult = 5 + 07;

// Error: no-octal-escape
// const foooctacal = 'Copyright \251';

// Error: no-proto
const proto = obj.__proto__;

// Error: no-script-url
const loc = (location.href = 'javascript:void(0)');

// Error: no-self-compare
let xCompare = 5;

if (xCompare === xCompare) {
  // ...
}

// Error:  no-sequences
do {
  console.log('no-sequences');
} while ((console.log('do smth'), !!test));

// Error:  no-throw-literal
if (xCompare) {
  throw 0;
}

// Error:  no-unused-expressions
0;

// Error:  no-useless-call
foo.call(undefined, 1, 2, 3);

// Error:  no-useless-concat
let uselessconcat = '1' + '0';

// Error:  no-useless-escape
let uselessEsp = "'";

// Error:  no-useless-return
let returnfoo = function () {
  return;
};

// Error: radix
let radixSecondArgument = parseInt('071', 10);

// Error: wrap-iife
let wrapped = (function () {
  return { y: 1 };
})();

// Error: yoda
if ('red' === color) {
  // ...
}

// Error: @typescript-eslint/no-shadow
const shadow = 3;
function b() {
  const shadow = 10;
}

// Error: no-shadow-restricted-names
function NaN() {}

// Error: no-undef-init
let bar = undefined;

// Error: @typescript-eslint/no-unused-vars
const unusedFoo = (e) => {
  // ...
};

// Error: no-constant-binary-expression
const iqual = 'liquid' || 'regid';

// Error: @typescript-eslint/no-use-before-define
console.warn(beforeDefine);
const beforeDefine = 1;

// Error: @typescript-eslint/no-redeclare
let x = 1;
let x = 2;

// Error: no-var
var oldVar = 1;

// Error: prefer-const
let betterConst = 1;

// Error: brace-style
function braceStyled() {
  return true;
}

// Error: block-spacing
function blockSpacing() {
  return true;
}

// Error: comma-dangle
let danglearray = [1, 2];

// Error: comma-spacing
let arrComa = [1, 2];

// Error: comma-style
let comaStyle = 1,
  secondArg = 2;

// Error: computed-property-spacing
let computedArr = [1, 2, 3];
let spacingArr = computedArr[0];

// Error: consistent-this
let self = 42;

// Error: func-call-spacing
foo();

// Error: func-name-matching
let foo = function bar() {};

// Error: id-length
const fiftennIfiftennIdfiftennIdfiftennIdfiftennIdfiftennIdd = 9;

// Error: key-spacing
let wrongObj = { foo: 42 };

// Error: keyword-spacing
if (foo) {
  // ...
} else if (bar) {
  // ...
} else {
  // ...
}

// Error: max-depth
function foo() {
  for (;;) {
    // Nested 1 deep
    while (true) {
      // Nested 2 deep
      if (bar) {
        // Nested 3 deep
        if (bar) {
          // Nested 4 deep
          if (bar) {
            // Nested 5 deep
          }
        }
      }
    }
  }
}

// Error: max-len
// comeents lengt nkjenklan kneknrfkeanrkenrkn nrkenarlknrklaner arenaklenrklaenrlkan aernakenrklaen

// Error: max-nested-callbacks
foo(function () {
  foo(function () {
    foo(function () {
      foo(function () {
        // Do something
      });
    });
  });
});

// Error: max-params
function foo1(bar, baz, qux, qxx, xyz, xxx) {
  // ...
}

// Error: max-statements-per-line
let wow;
let yes;
let pow;

// Error: new-cap
let friend = new person();

// Error: new-parens
let person = new Person();

// Error: no-array-constructor
Array();

// Error: no-bitwise
let bitoperator = y | z;

// Error: no-lonely-if
if (condition) {
  // ...
} else {
  if (anotherCondition) {
    // ...
  }
}

// Error: no-mixed-spaced-and-tabs
function main() {
  const x = 5,
    y = 7;
}

// Error: no-multiple-empty-lines
const mulLines = 5;

const mulLines2 = 3;

// Error: no-negated-condition
if (!foo) {
  // ...
} else {
  // ...
}

// Error: no-new-object
let myObject = new Object();

// Error: no-tabs
let tabs = 2;

// Error: no-nested-ternary
let thing = foo ? bar : baz === qux ? quxx : foobar;

// Error: no-trailing-spaces
const trailing = 5;

// Error: no-unneeded-ternary
let unneedTernanry = x === 2 ? true : false;

// Error: no-whitespace-before-property
let whitespace = numbers[0];

// Error: object-curly-spacing
let testObj = { foo: 'bar' };

// Error: one-var-declaration-per-line
let d,
  e = 0,
  f;

// Error: operator-assignment
x = y * x;

// Error: operator-linebreak
if (foo || foo1) {
  // ...
}

// Error: padded-blocks
if (foo) {
  b();
}

// Error: padding-line-between-statements
const noPadding = '';
function foo() {
  bar();
  return;
}

// Error: quote-props
let object1 = {
  'foo': 'bar',
  'baz': 42,
  'qux-lorem': true,
};

// Error: quotes
const message = 'Hello World';

// Error: semi
let testName = 'John';

// Error: semi-spacing
let testNameSec = 'John';

// Error: semi-style
foo();
[1, 2, 3].forEach(bar);

// Error: space-before-blocks
function a() {
  foo();
}

// Error: space-in-parens
foo();

// Error: space-infix-ops
let ops = 1 + 1;

// Error: space-unary-ops
++ops;

// Error: spaced-comment
//This is a comment with no whitespace at the beginning

// Error: switch-colon-spacing
switch (a) {
  case 0:
    break;
  default:
    foo();
}

// Error: unicode-bom (not sure how to verify yet)

// Error: no-case-declarations
switch (foo) {
  case 1:
    let x = 1;

    break;
  case 2:
    const y = 2;

    break;
  case 3:
    function f() {}

    break;
  default:
    class C {}
}

// Error: no-constant-condition
if (false) {
  // ...
}

// Error: naming-convention
type invalid_type_name = {};
class invalid_class_name {}
interface invalid_interface_name {}
enum invalid_enum_name {}

// Error: no-restricted-globals
const someRegExp = new RegExp('123');

// Error: no-restricted-globals
const someMutationObserver = new MutationObserver(() => {
  // ...
});

// Error: custom/no-restricted-syntax
const noRestrictedSyntax = ({ someParam }) => {
  return someParam;
};

// Error: arrow-body-style
const arrowBodyStyle = () => 'arrowBodyStyle';

/* REACT */

// Error: react/jsx-handler-names
<MyComponent handleChange={this.handleChange} />;

// Error: react/hook-use-state
const [isState, setState] = useState<null | number>(null);

// Error: react/boolean-prop-naming
type Props = {
  enabled: boolean;
};

export const Component: FC<Props> = (props) => {
  return <div />;
};

// Error: custom/escaped-regexp-syntax
const regexp_template_literals = new EscapedRegExp(`^path/${rtl_dir}`, {
  rtl_dir: 'src',
});
const regexp_missing_val = new EscapedRegExp('^path/${dir}', {});
const regexp_unused_var = new EscapedRegExp('^path/${dir}', {
  dir: 'src',
  user: 'home',
});

// Error: react-you-might-not-need-an-effect/no-derived-state
const FormWithDerivedState = () => {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);

  return <div>{fullName}</div>;
};

// Error: react-you-might-not-need-an-effect/no-chain-state-updates
// Error: react-you-might-not-need-an-effect/no-event-handler
const GameWithChainStateUpdates = () => {
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (round > 10) {
      setIsGameOver(true);
    }
  }, [round]);

  return <div>Round {round}</div>;
};

// Error: react-you-might-not-need-an-effect/no-adjust-state-on-prop-change
interface ListWithStateAdjustmentProps {
  /**
   *
   */
  items: never[];
}

const ListWithStateAdjustment = (props: ListWithStateAdjustmentProps) => {
  const { items } = props;
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    setSelection(null);
  }, [items]);

  return <div />;
};

// Error: react-you-might-not-need-an-effect/no-pass-live-state-to-parent
interface ChildWithLiveStateToParentProps {
  /**
   *
   */
  onTextChanged: (text: string) => void;
}

const ChildWithLiveStateToParent = (props: ChildWithLiveStateToParentProps) => {
  const { onTextChanged } = props;
  const [text, setText] = useState('');

  useEffect(() => {
    onTextChanged(text);
  }, [onTextChanged, text]);

  return <input />;
};

// Error: react-you-might-not-need-an-effect/no-pass-data-to-parent
interface ChildWithDataToParentProps {
  /**
   *
   */
  onDataFetched: (data: string) => void;
}

const useSomeData = () => {
  return 'external data';
};

const ChildWithDataToParent = (props: ChildWithDataToParentProps) => {
  const { onDataFetched } = props;
  const data = useSomeData();

  useEffect(() => {
    onDataFetched(data);
  }, [data, onDataFetched]);

  return <div>{data}</div>;
};

// Error: react-you-might-not-need-an-effect/no-initialize-state
const ComponentWithInitializeState = () => {
  const [someState, setSomeState] = useState('');

  useEffect(() => {
    setSomeState('Hello World');
  }, []);

  return <div>{someState}</div>;
};

// Error: react-you-might-not-need-an-effect/no-empty-effect
const ComponentWithEmptyEffect = () => {
  useEffect(() => {
    //
  }, []);

  return <div>Component</div>;
};

// Error: react-you-might-not-need-an-effect/no-reset-all-state-on-prop-change
interface ListWithResetAllStateProps {
  /**
   *
   */
  items: never[];
}

const ListWithResetAllState = (props: ListWithResetAllStateProps) => {
  const { items } = props;
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    setSelection(null);
  }, [items]);

  return <div />;
};

// Error: react-you-might-not-need-an-effect/no-pass-ref-to-parent
interface ChildWithRefToParentProps {
  /**
   *
   */
  onRef: (ref: HTMLDivElement | null) => void;
}

const ChildWithRefToParent = (props: ChildWithRefToParentProps) => {
  const { onRef } = props;
  const ref = useRef(null);

  useEffect(() => {
    onRef(ref.current);
  }, [onRef, ref.current]);

  return <div ref={ref} />;
};

// Error: react-you-might-not-need-an-effect/no-pass-ref-to-parent (with listener)
interface ChildWithRefListenerProps {
  /**
   *
   */
  onClicked: (event: MouseEvent) => void;
}

const ChildWithRefListener = (props: ChildWithRefListenerProps) => {
  const { onClicked } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (element) {
      element.addEventListener('click', (event: MouseEvent) => {
        onClicked(event);
      });
    }
  }, [onClicked]);

  return <div ref={ref} />;
};

// Error: no-restricted-syntax (Omit usage)
type UserWithoutPassword = Omit<
  {
    /**
     *
     */
    id: number;
    /**
     *
     */
    name: string;
    /**
     *
     */
    password: string;
  },
  'password'
>;
type AnotherOmitExample = Omit<Props, 'enabled'>;

// Error: custom/no-border-radius-literal (borderRadius: 3)
const ComponentWithBorderRadius3 = () => {
  return <div style={{ borderRadius: 3 }} />;
};

// Error: custom/no-border-radius-literal (borderRadius: 4)
const ComponentWithBorderRadius4 = () => {
  return <div style={{ borderRadius: 4 }} />;
};

// Error: custom/no-border-radius-literal (borderRadius: "3px")
const ComponentWithBorderRadius3px = () => {
  return <div style={{ borderRadius: '3px' }} />;
};

// Error: custom/no-border-radius-literal (borderRadius: "4px")
const ComponentWithBorderRadius4px = () => {
  return <div style={{ borderRadius: '4px' }} />;
};

// Error: custom/no-border-radius-literal (borderRadius: "3")
const ComponentWithBorderRadius3String = () => {
  return <div style={{ borderRadius: '3' }} />;
};

// Error: custom/no-border-radius-literal (borderRadius: "4")
const ComponentWithBorderRadius4String = () => {
  return <div style={{ borderRadius: '4' }} />;
};

// Error: custom/no-border-radius-literal (borderTopLeftRadius: 3)
const ComponentWithBorderTopLeftRadius3 = () => {
  return <div style={{ borderTopLeftRadius: 3 }} />;
};

// Error: custom/no-border-radius-literal (borderTopRightRadius: 4)
const ComponentWithBorderTopRightRadius4 = () => {
  return <div style={{ borderTopRightRadius: 4 }} />;
};

// Error: custom/no-border-radius-literal (borderBottomLeftRadius: 3)
const ComponentWithBorderBottomLeftRadius3 = () => {
  return <div style={{ borderBottomLeftRadius: 3 }} />;
};

// Error: custom/no-border-radius-literal (borderBottomRightRadius: 4)
const ComponentWithBorderBottomRightRadius4 = () => {
  return <div style={{ borderBottomRightRadius: 4 }} />;
};

// Error: custom/no-border-radius-literal (borderRadius: 5px 3px)
const ComponentWithBorderRadius5px3px = () => {
  return <div style={{ borderRadius: '5px 3px' }} />;
};

// Error: custom/no-border-radius-literal (borderRadius: 5px 4px)
const ComponentWithBorderRadius5px4px = () => {
  return <div style={{ borderRadius: '5px 4px' }} />;
};

// Error: no-implicit-coercion
const implicitCoercionToBoolean = !!5;
const implicitCoercionToString = 2 + '';
const implicitCoercionToNumber = +false;
