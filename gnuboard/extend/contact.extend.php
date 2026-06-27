<?php
if (!defined('_GNUBOARD_')) exit;

/**
 * 문의 게시판(inquiry) 글 등록 후 온라인 문의 페이지로 리다이렉트
 * 게시판 테이블명이 다르면 아래 $contact_board 값을 변경하세요.
 */
$contact_board = 'inquiry';

add_replace('write_update_move_url', 'sscan_contact_write_move_url', 10, 6);

function sscan_contact_write_move_url($redirect_url, $board, $wr_id, $w, $qstr, $file_upload_msg)
{
    global $contact_board;

    if (($board['bo_table'] ?? '') !== $contact_board || $w === 'u') {
        return $redirect_url;
    }

    return G5_URL . '/inquiry.php?contact=success';
}
