<?php
$non_supported_extensions = array("EXE", "PIF", "APPLICATION", "GADGET", "MSI", "MSP", "COM", "SCR", "HTA", "CPL", "MSC", "JAR", "BAT", "CMD", "JS", "JSE", "WS", "REG", "SH");

function checkSupportedExtension($extension)
{
    global $non_supported_extensions;

    if (in_array(strtoupper($extension), $non_supported_extensions)) {
        return false;
    }

    return true;
}

function formatBytes($size, $precision = 2)
{
    $base = log($size, 1024);
    $suffixes = array('bytes', 'KB', 'MB', 'GB', 'TB');

    return round(pow(1024, $base - floor($base)), $precision) . ' ' . $suffixes[floor($base)];
}

function readFolder($path)
{
    $extension_icons = [
        // archive
        'zip' => '<i class="fas fa-file-archive"></i>',
        'rar' => '<i class="fas fa-file-archive"></i>',
        'gz' => '<i class="fas fa-file-archive"></i>',
        '7z' => '<i class="fas fa-file-archive"></i>',

        // image
        'jpg' => '<i class="fas fa-file-image"></i>',
        'png' => '<i class="fas fa-file-image"></i>',
        'bmp' => '<i class="fas fa-file-image"></i>',
        'gif' => '<i class="fas fa-file-image"></i>',

        // audio
        'mp3' => '<i class="fas fa-file-audio"></i>',
        'wav' => '<i class="fas fa-file-audio"></i>',
        'm4a' => '<i class="fas fa-file-audio"></i>',

        // video
        'mp4' => '<i class="fas fa-file-video"></i>',
        'mkv' => '<i class="fas fa-file-video"></i>',
        'mov' => '<i class="fas fa-file-video"></i>',

        // Document
        'doc' => '<i class="fas fa-file-word"></i>',
        'docx' => '<i class="fas fa-file-word"></i>',
        'txt'=> '<i class="fas fa-file-alt"></i>',


        // pdf
        'pdf' => '<i class="fas fa-file-pdf"></i>',

        //Excel
        'xlsx' => '<i class="fas fa-file-excel"></i>',
        'xls' => '<i class="fas fa-file-excel"></i>',

        // powerpoint
        'ppt' => '<i class="fas fa-file-powerpoint"></i>',
        'pptx' => '<i class="fas fa-file-powerpoint"></i>',

        // code
        'html' => '<i class="fas fa-file-code"></i>',
        'css' => '<i class="fas fa-file-code"></i>',
        'php' => '<i class="fas fa-file-code"></i>',
        'js' => '<i class="fas fa-file-code"></i>',
        'c' => '<i class="fas fa-file-code"></i>',
        'cs' => '<i class="fas fa-file-code"></i>',
        'java' => '<i class="fas fa-file-code"></i>'
    ];

    $file_type = [
        // archive
        'zip' => 'Compressed File',
        'rar' => 'Compressed File',
        'gz' => 'Compressed File',
        '7z' => 'Compressed File',

        // image
        'jpg' => 'Image',
        'png' => 'Image',
        'bmp' => 'Image',
        'bmp' => 'Image',

        // audio
        'mp3' => 'Audio',
        'wav' => 'Audio',
        'm4a' => 'Audio',

        // video
        'mp4' => 'Video',
        'mkv' => 'Video',
        'mov' => 'Video',

        // Document
        'doc' => 'Microsoft Word 2013',
        'docx' => 'Microsoft Word 2010',
        'txt' => 'Text Document',

        // pdf
        'pdf' => 'PDF Document',

        //Excel
        'xlsx' => 'Microsoft Excel 2010',
        'xls' => 'Microsoft Excel 2003',

        // powerpoint
        'ppt' => 'Microsoft PowerPoint 2003',
        'pptx' => 'Microsoft PowerPoint 2007',

        // code
        'html' => 'HTML Document',
        'css' => 'Cascading Style Sheets',
        'php' => 'PHP Code',
        'js' => 'JavaSciprt Code',
        'c'=> 'C Code',
        'cs' => 'C-Shard Code',
        'java' => 'Java Code'
    ];

    if(!file_exists($path)){
        return array();
    }
    // Get all list files by path
    $listFiles = array_diff(scandir($path), array('.', '..'));


    $files = array();

    foreach ($listFiles as $file) {

        // Get current path / file name
        $filePath = "$path/$file";

        $ext =strtolower(pathinfo($filePath, PATHINFO_EXTENSION)); // get file path extension
        $filesize = filesize($filePath);
        $url = substr($path, 7) . $file;

        if (array_key_exists($ext, $extension_icons)) {
            $icon = $extension_icons[$ext];
        } else {
            $icon = '<i class="fa fa-file"></i>';
        };

        if (array_key_exists($ext, $file_type)) {
            $type = $file_type[$ext];
        } else {
            $type = 'File';
        };

        if ($filesize != '-') {
            $filesize = formatBytes(floatval($filesize));
        }

        $fileInfo = array(
            'FileName' => $file, 'FileIcon' => $icon, 'FileType' => $type,
            'FilePath' => $url, 'FileSize' => $filesize
        );

        array_push($files, $fileInfo);
    };

    return $files;
}
