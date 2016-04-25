/* @flow */

import React, {Component} from 'react';
import classNames from 'classnames';

type DefaultProps = {
  numButtons: number,
  onPageChange: (value: number) => any,
  onOffsetChange: (offset: number) => any,
};

type Props = {
  className?: string,
  page?: number,
  onPageChange: (value: number) => any,
  offset: number,
  onOffsetChange: (offset: number) => any,
  numPages: number,
  numButtons: number
};

export default class Pager extends Component<DefaultProps,Props,void> {
  static defaultProps = {
    numButtons: 5,
    onPageChange() {},
    onOffsetChange() {}
  };
  setOffset: (offset: number) => void = offset => {
    let {onOffsetChange, numButtons, numPages} = this.props;
    onOffsetChange(Math.max(0, Math.min(numPages - numButtons, offset)));
  };
  render(): React.Element {
    let {className, page, onPageChange, numPages, offset, numButtons} = this.props;
    let {setOffset} = this;

    let buttons = [];

    for (let otherPage = Math.max(0, offset); otherPage < offset + numButtons && otherPage < numPages; otherPage++) {
      let content = otherPage + 1;
      if (otherPage === page) {
        content = <span>{otherPage + 1} <span className="sr-only">(current)</span></span>;
      }
      buttons.push(<li key={otherPage} className={otherPage === page ? 'active' : undefined}>
        <a onClick={() => onPageChange(otherPage)}>{content}</a>
      </li>);
    }

    if (numPages > numButtons) {
      buttons = [
        <li key="previous" className={offset <= 0 ? 'disabled' : undefined}>
          <a onClick={() => setOffset(offset - numButtons)} ariaLabel="Previous">
            <span ariaHidden="true">&laquo;</span>
          </a>
        </li>,
        ...buttons,
        <li key="next" className={offset + numButtons >= numPages ? 'disabled' : undefined}>
          <a onClick={() => setOffset(offset + numButtons)} ariaLabel="Next">
            <span ariaHidden="true">&raquo;</span>
          </a>
        </li>
      ];
    }

    className = classNames(className, 'pagination', 'noselect');

    return <ul {...this.props} className={className}>
      {buttons}
    </ul>;
  }
}
