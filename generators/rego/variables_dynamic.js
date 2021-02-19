/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating Rego for dynamic variable blocks.
 * @author fenichel@google.com (Rachel Fenichel)
 */
'use strict';

goog.provide('Blockly.Rego.variablesDynamic');

goog.require('Blockly.Rego');
goog.require('Blockly.Rego.variables');


// Rego is dynamically typed.
Blockly.Rego['variables_get_dynamic'] =
    Blockly.Rego['variables_get'];
Blockly.Rego['variables_set_dynamic'] =
    Blockly.Rego['variables_set'];
