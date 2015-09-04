/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
    // config.uiColor = '#AADC6E';

    //config.language = 'zh-cn';  // 中文
    //config.tabSpaces = 4;       // 当用户键入TAB时，编辑器走过的空格数，当值为0时，焦点将移出编辑框
    //config.toolbar = "Custom_RainMan";    // 工具条配置
    config.editingBlock = false;
    config.startupMode = 'source';
    config.fullPage = false;;
    //config.skin = 'v2';
    ////config.enterMode = CKEDITOR.ENTER_DIV;
    config.enterMode = CKEDITOR.ENTER_BR;
    config.shiftEnterMode = CKEDITOR.ENTER_P;
    config.allowedContent = true;
    // config.ignoreEmptyParagraph = true;
    //config.toolbar_Custom_RainMan = [
    //    ['Undo', 'Redo', '-', 'Find', 'Replace', '-', 'SelectAll', 'RemoveFormat'],
    //    ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord'],
    //    ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
    //    '/',
    //    ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'],
    //    ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote'],
    //    ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
    //    ['Link', 'Unlink', 'Anchor'],
    //    ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak'],
    //    '/',
    //    ['Styles', 'Format', 'Font', 'FontSize'],
    //    ['TextColor', 'BGColor'],
    //    ['Maximize', 'ShowBlocks', 'Templates', 'Source']
    //];
};
