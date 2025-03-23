<?php
/**
 * Plugin Name: Unadorned Announcement Bar
 * Author: Plugin Author
 * Text Domain: unadorned-announcement-bar
 */

//register a sub-menu under the Settings menu
function unadorned_announcement_bar_settings_page()
{
    add_options_page(
        __('Unadorned Announcement Bar', 'unadorned-announcement-bar'),
        __('Unadorned Announcement Bar', 'unadorned-announcement-bar'),
        'manage_options',
        'unadorned-announcement-bar',
        'unadorned_announcement_bar_settings_page_html'
    );
}

//Callback function for unadorned-announcement-bar options page
add_action('admin_menu', 'unadorned_announcement_bar_settings_page');

function unadorned_announcement_bar_settings_page_html()
{
    printf(
        '<div class="wrap" id="unadorned-announcement-bar-settings">%s</div>',
        esc_html__('Loading…', 'unadorned-announcement-bar')
    );
}

//Enqueuing the JavaScript for React
function unadorned_announcement_bar_settings_page_enqueue_style_script($admin_page)
{
    if ('settings_page_unadorned-announcement-bar' !== $admin_page) {
        return;
    }

    $asset_file = plugin_dir_path(__FILE__) . 'build/index.asset.php';

    if (!file_exists($asset_file)) {
        return;
    }

    $asset = include $asset_file;

    wp_enqueue_script(
        'unadorned-announcement-bar-script',
        plugins_url('build/index.js', __FILE__),
        $asset['dependencies'],
        $asset['version'],
        array(
            'in_footer' => true,
        )
    );

    wp_enqueue_style('wp-components');
}

add_action('admin_enqueue_scripts', 'unadorned_announcement_bar_settings_page_enqueue_style_script');


//Defining the default and schema for the announcement bar
function unadorned_announcement_bar_settings()
{

    $default = array(
        'message' => __('Hello World', 'unadorned-announcement-bar'),
        'display' => true,
        'size' => 'medium'
    );

    $schema = array(
        'type' => 'object',
        'properties' => array(
            'message' => array(
                'type' => 'string',
            ),
            'display' => array(
                'type' => 'boolean',
            ),
            'size' => array(
                'type' => 'string',
                'enum' => array('small', 'medium', 'large', 'xl'),
            ),
        )
    );

    register_setting(
        'options',
        'unadorned_announcement_bar',
        array(
            'type' => 'object',
            'default' => $default,
            'show_in_rest' => array(
                'schema' => $schema,
            ),
        )
    );

}

add_action('init', 'unadorned_announcement_bar_settings');


//Loading the settings for the announcement bar settings


