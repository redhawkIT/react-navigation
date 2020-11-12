import * as React from 'react';
import { StackActions, useNavigationState } from '@react-navigation/native';

import HeaderSegment from './HeaderSegment';
import HeaderTitle from './HeaderTitle';
import HeaderShownContext from '../../utils/HeaderShownContext';
import ModalPresentationContext from '../../utils/ModalPresentationContext';
import debounce from '../../utils/debounce';
import type { StackHeaderProps, StackHeaderTitleProps } from '../../types';

export default React.memo(function Header({
  previous,
  layout,
  insets,
  progress,
  options,
  route,
  navigation,
  styleInterpolator,
}: StackHeaderProps) {
  const title =
    typeof options.headerTitle !== 'function' &&
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : route.name;

  let leftLabel;

  // The label for the left back button shows the title of the previous screen
  // If a custom label is specified, we use it, otherwise use previous screen's title
  if (options.headerBackTitle !== undefined) {
    leftLabel = options.headerBackTitle;
  } else if (previous) {
    const o = previous.options;

    leftLabel =
      typeof o.headerTitle !== 'function' && o.headerTitle !== undefined
        ? o.headerTitle
        : o.title !== undefined
        ? o.title
        : previous.route.name;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const goBack = React.useCallback(
    debounce(() => {
      if (navigation.isFocused() && navigation.canGoBack()) {
        navigation.dispatch({
          ...StackActions.pop(),
          source: route.key,
        });
      }
    }, 50),
    [navigation, route.key]
  );

  const isModal = React.useContext(ModalPresentationContext);
  const isParentHeaderShown = React.useContext(HeaderShownContext);
  const isFirstRouteInParent = useNavigationState(
    (state) => state.routes[0].key === route.key
  );

  const statusBarHeight =
    (isModal && !isFirstRouteInParent) || isParentHeaderShown ? 0 : insets.top;

  return (
    <HeaderSegment
      {...options}
      progress={progress}
      insets={insets}
      layout={layout}
      title={title}
      leftLabel={leftLabel}
      headerTitle={
        typeof options.headerTitle !== 'function'
          ? (props: StackHeaderTitleProps) => <HeaderTitle {...props} />
          : options.headerTitle
      }
      headerStatusBarHeight={statusBarHeight}
      onGoBack={previous ? goBack : undefined}
      styleInterpolator={styleInterpolator}
    />
  );
});
