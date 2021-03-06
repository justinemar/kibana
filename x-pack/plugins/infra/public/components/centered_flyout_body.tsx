/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EuiFlyoutBody } from '@elastic/eui';
import { euiStyled } from '../../../observability/public';

export const CenteredEuiFlyoutBody = euiStyled(EuiFlyoutBody)`
  & .euiFlyoutBody__overflow {
    display: flex;
    flex-direction: column;
  }

  & .euiFlyoutBody__overflowContent {
    align-items: center;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    overflow: hidden;
  }
`;
