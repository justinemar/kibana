/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { i18n } from '@kbn/i18n';

import { FormSchema, fieldValidators } from '../../../../shared_imports';
import { defaultSetPriority, defaultPhaseIndexPriority } from '../../../constants';
import { ROLLOVER_FORM_PATHS } from '../constants';

const rolloverFormPaths = Object.values(ROLLOVER_FORM_PATHS);

import { FormInternal } from '../types';

import {
  ifExistsNumberGreaterThanZero,
  ifExistsNumberNonNegative,
  rolloverThresholdsValidator,
  minAgeValidator,
} from './validations';

import { i18nTexts } from '../i18n_texts';

const { emptyField, numberGreaterThanField } = fieldValidators;

const serializers = {
  stringToNumber: (v: string): any => (v != null ? parseInt(v, 10) : undefined),
};

export const schema: FormSchema<FormInternal> = {
  _meta: {
    hot: {
      useRollover: {
        defaultValue: true,
        label: i18n.translate('xpack.indexLifecycleMgmt.hotPhase.enableRolloverLabel', {
          defaultMessage: 'Enable rollover',
        }),
      },
      maxStorageSizeUnit: {
        defaultValue: 'gb',
      },
      maxAgeUnit: {
        defaultValue: 'd',
      },
      bestCompression: {
        label: i18nTexts.editPolicy.bestCompressionFieldLabel,
        helpText: i18nTexts.editPolicy.bestCompressionFieldHelpText,
      },
    },
    warm: {
      enabled: {
        defaultValue: false,
        label: i18n.translate(
          'xpack.indexLifecycleMgmt.editPolicy.warmPhase.activateWarmPhaseSwitchLabel',
          { defaultMessage: 'Activate warm phase' }
        ),
      },
      warmPhaseOnRollover: {
        defaultValue: true,
        label: i18n.translate('xpack.indexLifecycleMgmt.warmPhase.moveToWarmPhaseOnRolloverLabel', {
          defaultMessage: 'Move to warm phase on rollover',
        }),
      },
      minAgeUnit: {
        defaultValue: 'ms',
      },
      bestCompression: {
        label: i18nTexts.editPolicy.bestCompressionFieldLabel,
        helpText: i18nTexts.editPolicy.bestCompressionFieldHelpText,
      },
      dataTierAllocationType: {
        label: i18nTexts.editPolicy.allocationTypeOptionsFieldLabel,
      },
      allocationNodeAttribute: {
        label: i18nTexts.editPolicy.allocationNodeAttributeFieldLabel,
      },
    },
    cold: {
      enabled: {
        defaultValue: false,
        label: i18n.translate(
          'xpack.indexLifecycleMgmt.editPolicy.coldPhase.activateColdPhaseSwitchLabel',
          { defaultMessage: 'Activate cold phase' }
        ),
      },
      freezeEnabled: {
        defaultValue: false,
        label: i18n.translate('xpack.indexLifecycleMgmt.coldPhase.freezeIndexLabel', {
          defaultMessage: 'Freeze index',
        }),
      },
      minAgeUnit: {
        defaultValue: 'd',
      },
      dataTierAllocationType: {
        label: i18nTexts.editPolicy.allocationTypeOptionsFieldLabel,
      },
      allocationNodeAttribute: {
        label: i18nTexts.editPolicy.allocationNodeAttributeFieldLabel,
      },
    },
    delete: {
      enabled: {
        defaultValue: false,
        label: i18n.translate(
          'xpack.indexLifecycleMgmt.editPolicy.deletePhase.activateWarmPhaseSwitchLabel',
          { defaultMessage: 'Activate delete phase' }
        ),
      },
      minAgeUnit: {
        defaultValue: 'd',
      },
    },
  },
  phases: {
    hot: {
      actions: {
        rollover: {
          max_age: {
            label: i18n.translate('xpack.indexLifecycleMgmt.hotPhase.maximumAgeLabel', {
              defaultMessage: 'Maximum age',
            }),
            validations: [
              {
                validator: rolloverThresholdsValidator,
              },
              {
                validator: ifExistsNumberGreaterThanZero,
              },
            ],
            fieldsToValidateOnChange: rolloverFormPaths,
          },
          max_docs: {
            label: i18n.translate('xpack.indexLifecycleMgmt.hotPhase.maximumDocumentsLabel', {
              defaultMessage: 'Maximum documents',
            }),
            validations: [
              {
                validator: rolloverThresholdsValidator,
              },
              {
                validator: ifExistsNumberGreaterThanZero,
              },
            ],
            serializer: serializers.stringToNumber,
            fieldsToValidateOnChange: rolloverFormPaths,
          },
          max_size: {
            label: i18n.translate('xpack.indexLifecycleMgmt.hotPhase.maximumIndexSizeLabel', {
              defaultMessage: 'Maximum index size',
            }),
            validations: [
              {
                validator: rolloverThresholdsValidator,
              },
              {
                validator: ifExistsNumberGreaterThanZero,
              },
            ],
            fieldsToValidateOnChange: rolloverFormPaths,
          },
        },
        forcemerge: {
          max_num_segments: {
            label: i18nTexts.editPolicy.maxNumSegmentsFieldLabel,
            validations: [
              {
                validator: emptyField(
                  i18n.translate(
                    'xpack.indexLifecycleMgmt.editPolicy.forcemerge.numberOfSegmentsRequiredError',
                    { defaultMessage: 'A value for number of segments is required.' }
                  )
                ),
              },
              {
                validator: ifExistsNumberGreaterThanZero,
              },
            ],
            serializer: serializers.stringToNumber,
          },
        },
        shrink: {
          number_of_shards: {
            label: i18n.translate('xpack.indexLifecycleMgmt.shrink.numberOfPrimaryShardsLabel', {
              defaultMessage: 'Number of primary shards',
            }),
            validations: [
              {
                validator: emptyField(i18nTexts.editPolicy.errors.numberRequired),
              },
              {
                validator: numberGreaterThanField({
                  message: i18nTexts.editPolicy.errors.numberGreatThan0Required,
                  than: 0,
                }),
              },
            ],
            serializer: serializers.stringToNumber,
          },
        },
        set_priority: {
          priority: {
            defaultValue: defaultSetPriority as any,
            label: i18nTexts.editPolicy.setPriorityFieldLabel,
            validations: [{ validator: ifExistsNumberNonNegative }],
            serializer: serializers.stringToNumber,
          },
        },
      },
    },
    warm: {
      min_age: {
        defaultValue: '0',
        validations: [
          {
            validator: minAgeValidator,
          },
        ],
      },
      actions: {
        allocate: {
          number_of_replicas: {
            label: i18n.translate('xpack.indexLifecycleMgmt.warmPhase.numberOfReplicasLabel', {
              defaultMessage: 'Number of replicas (optional)',
            }),
            validations: [
              {
                validator: ifExistsNumberNonNegative,
              },
            ],
            serializer: serializers.stringToNumber,
          },
        },
        shrink: {
          number_of_shards: {
            label: i18n.translate('xpack.indexLifecycleMgmt.shrink.numberOfPrimaryShardsLabel', {
              defaultMessage: 'Number of primary shards',
            }),
            validations: [
              {
                validator: emptyField(i18nTexts.editPolicy.errors.numberRequired),
              },
              {
                validator: numberGreaterThanField({
                  message: i18nTexts.editPolicy.errors.numberGreatThan0Required,
                  than: 0,
                }),
              },
            ],
            serializer: serializers.stringToNumber,
          },
        },
        forcemerge: {
          max_num_segments: {
            label: i18nTexts.editPolicy.maxNumSegmentsFieldLabel,
            validations: [
              {
                validator: emptyField(
                  i18n.translate(
                    'xpack.indexLifecycleMgmt.editPolicy.forcemerge.numberOfSegmentsRequiredError',
                    { defaultMessage: 'A value for number of segments is required.' }
                  )
                ),
              },
              {
                validator: ifExistsNumberGreaterThanZero,
              },
            ],
            serializer: serializers.stringToNumber,
          },
        },
        set_priority: {
          priority: {
            defaultValue: defaultPhaseIndexPriority as any,
            label: i18nTexts.editPolicy.setPriorityFieldLabel,
            validations: [{ validator: ifExistsNumberNonNegative }],
            serializer: serializers.stringToNumber,
          },
        },
      },
    },
    cold: {
      min_age: {
        defaultValue: '0',
        validations: [
          {
            validator: minAgeValidator,
          },
        ],
      },
      actions: {
        allocate: {
          number_of_replicas: {
            label: i18n.translate('xpack.indexLifecycleMgmt.coldPhase.numberOfReplicasLabel', {
              defaultMessage: 'Number of replicas (optional)',
            }),
            validations: [
              {
                validator: ifExistsNumberNonNegative,
              },
            ],
            serializer: serializers.stringToNumber,
          },
        },
        set_priority: {
          priority: {
            defaultValue: '0' as any,
            label: i18nTexts.editPolicy.setPriorityFieldLabel,
            validations: [{ validator: ifExistsNumberNonNegative }],
            serializer: serializers.stringToNumber,
          },
        },
        searchable_snapshot: {
          snapshot_repository: {
            label: i18nTexts.editPolicy.searchableSnapshotsFieldLabel,
            validations: [
              { validator: emptyField(i18nTexts.editPolicy.errors.searchableSnapshotRepoRequired) },
            ],
          },
        },
      },
    },
    delete: {
      min_age: {
        defaultValue: '0',
        validations: [
          {
            validator: minAgeValidator,
          },
        ],
      },
    },
  },
};
