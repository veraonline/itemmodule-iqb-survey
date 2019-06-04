rem preparing folders
mkdir "compilation"
mkdir "compilation\typescript_compiled_files"
mkdir "compilation\babeljs_compiled_files"
mkdir "compilation\final_bundled_files"
mkdir "build"
mkdir "build\unitPlayer"
mkdir "build\unitAuthoring"
rem call command based on idea from https://stackoverflow.com/a/4036937
rem stackoverflow post by: https://stackoverflow.com/users/390278/jeff-mercado
rem stackoverflow license: cc by-sa 3.0
call tsc
rem transpiling code using babeljs
call "./node_modules/.bin/babel" "compilation\typescript_compiled_files" --out-dir "compilation\babeljs_compiled_files"
rem bundling up the code
call webpack "compilation\babeljs_compiled_files\surveyPlayer\typescript\IQBSurveyPlayer.js" -o "compilation\final_bundled_files\IQBSurveyPlayer_Bundled.js" --mode development
rem finishing up Survey Authoring Tool
xcopy "src\surveyAuthoring" "build\unitAuthoring"  /E /Y
rem finishing up IQBSurveyPlayer
copy /b "src\surveyPlayer\html\html_start.html" + "src\surveyPlayer\html\head_start.html" + "src\surveyPlayer\html\head_maincontent.html" + "src\surveyPlayer\html\script_start.html" + "src\surveyPlayer\includes\jquery-3.3.1.js" + "src\surveyPlayer\html\script_end.html" + "src\surveyPlayer\html\script_start.html" + "src\surveyPlayer\includes\jquery-ui-1.12.1.custom\trimmed\jquery-ui.js" + "src\surveyPlayer\html\script_end.html" + "src\surveyPlayer\html\style_start.html" + "src\surveyPlayer\includes\jquery-ui-1.12.1.custom\trimmed\jquery-ui.css" + "src\surveyPlayer\html\style_end.html" + "src\surveyPlayer\html\style_start.html" + "src\surveyPlayer\css\IQBSurveyPlayer.css" + "src\surveyPlayer\html\style_end.html" + "src\surveyPlayer\html\script_start.html" + "compilation\final_bundled_files\IQBSurveyPlayer_Bundled.js" + "src\surveyPlayer\html\script_end.html" + "src\surveyPlayer\html\head_end.html"  + "src\surveyPlayer\html\body_start.html" + "src\surveyPlayer\html\body_maincontent.html" + "src\surveyPlayer\html\body_end.html" + "src\surveyPlayer\html\html_end.html" "build\unitPlayer\IQBSurveyPlayerV3.html"
