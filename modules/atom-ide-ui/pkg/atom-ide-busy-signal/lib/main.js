/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 * @format
 */

import type {BusySignalService} from './types';

import createPackage from 'nuclide-commons-atom/createPackage';
import UniversalDisposable from 'nuclide-commons/UniversalDisposable';
import BusySignalInstance from './BusySignalInstance';
import {MessageStore} from './MessageStore';
import StatusBarTile from './StatusBarTile';

class Activation {
  _disposables: UniversalDisposable;
  _messageStore: MessageStore;

  constructor() {
    this._messageStore = new MessageStore();
    this._disposables = new UniversalDisposable(this._messageStore);
  }

  dispose() {
    this._disposables.dispose();
  }

  consumeStatusBar(statusBar: atom$StatusBar): IDisposable {
    // Avoid retaining StatusBarTile by wrapping it.
    const disposable = new UniversalDisposable(
      new StatusBarTile(
        statusBar,
        this._messageStore.getMessageStream(),
        this._messageStore.getTargetStream(),
      ),
    );
    this._disposables.add(disposable);
    return disposable;
  }

  provideBusySignal(): BusySignalService {
    return new BusySignalInstance(this._messageStore);
  }
}

createPackage(module.exports, Activation);
