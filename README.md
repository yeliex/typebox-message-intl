# typebox-message-intl
typebox error messages i18n support

this module helps typebox error validation return i18n messages

## Install
```Bash
yarn add typebox-message-intl
```

## Usage
```typescript
// entry of your app
import { setErrorMessages } from 'typebox-message-intl'
import zhCN from 'typebox-message-intl/locale/zh-cn';

// if want to modify, just merge to zhCN object
setErrorMessages(zhCN);
```

## Api
```typescript
declare const setErrorMessages: (messages: Messages, setErrorFunction?: typeof SetErrorFunction) => void;
```

messages: The messages object, you can find it in `typebox-message-intl/locale` folder

setErrorFunction: optionally set SetErrorFunction of `@sinclare/typebox` module, to prevent multi version package in project


## Faq

### What to do if multi version `@sinclare/typebox` in project

manually pass `SetErrorFunction` to `setErrorMessages`
```typescript
import { SetErrorFunction } from '@sinclair/typebox';

setErrorMessages(zhCN, SetErrorFunction);
```
