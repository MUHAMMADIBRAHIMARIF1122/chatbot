// Interactive Chat Widget for n8n
(function() {
    // Initialize widget only once
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    // Load font resource - using Poppins for a fresh look
    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontElement);

    // Apply widget styles with completely different design approach
    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
        .chat-assist-widget {
            --chat-color-primary: var(--chat-widget-primary, #10b981);
            --chat-color-secondary: var(--chat-widget-secondary, #059669);
            --chat-color-tertiary: var(--chat-widget-tertiary, #047857);
            --chat-color-light: var(--chat-widget-light, #d1fae5);
            --chat-color-surface: var(--chat-widget-surface, #ffffff);
            --chat-color-text: var(--chat-widget-text, #1f2937);
            --chat-color-text-light: var(--chat-widget-text-light, #6b7280);
            --chat-color-border: var(--chat-widget-border, #e5e7eb);
            --chat-shadow-sm: 0 1px 3px rgba(16, 185, 129, 0.1);
            --chat-shadow-md: 0 4px 6px rgba(16, 185, 129, 0.15);
            --chat-shadow-lg: 0 10px 15px rgba(16, 185, 129, 0.2);
            --chat-radius-sm: 8px;
            --chat-radius-md: 12px;
            --chat-radius-lg: 20px;
            --chat-radius-full: 9999px;
            --chat-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Poppins', sans-serif;
        }

        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 90px;
            z-index: 100000;
            width: 380px;
            max-width: calc(100vw - 20px);
            height: min(580px, 100dvh);
            max-height: 100dvh;
            background: var(--chat-color-surface);
            border-radius: var(--chat-radius-lg);
            box-shadow: var(--chat-shadow-lg);
            border: 1px solid var(--chat-color-light);
            overflow: hidden;
            display: none;
            flex-direction: column;
            overscroll-behavior: contain;
            transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            will-change: transform;
        }

        .chat-assist-widget .chat-window.right-side {
            right: 20px;
            left: auto;
        }

        .chat-assist-widget .chat-window.left-side {
            left: 20px;
            right: auto;
        }

        .chat-assist-widget .chat-window.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        .chat-assist-widget .chat-header {
            position: sticky;
            top: 0;
            padding: 0 40px 0 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            height: 72px;
            min-height: 72px;
            max-height: 72px;
            border-top-left-radius: var(--chat-radius-lg);
            border-top-right-radius: var(--chat-radius-lg);
            overflow: hidden;
        }

        .chat-assist-widget .chat-header-logo {
            height: 90%;
            max-height: 68px;
            width: auto;
            max-width: calc(100% - 60px);
            object-fit: contain;
            display: block;
            margin: 0 auto;
            background: none;
            border-radius: 0;
            box-shadow: none;
            padding: 0 8px;
        }

        .chat-assist-widget .chat-header-title {
            font-size: 16px;
            font-weight: 600;
            color: white;
        }

        .chat-assist-widget .chat-close-btn {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            cursor: pointer;
            padding: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--chat-transition);
            font-size: 20px;
            border-radius: var(--chat-radius-full);
            width: 32px;
            height: 32px;
            min-width: 32px;
            min-height: 32px;
            z-index: 5;
            touch-action: manipulation;
        }

        .chat-assist-widget .chat-close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-50%) scale(1.1);
        }

        .chat-assist-widget .chat-welcome {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px 16px;
            text-align: center;
            width: 100%;
            max-width: 320px;
            box-sizing: border-box;
        }

        .chat-assist-widget .chat-welcome-title {
            font-size: 20px;
            font-weight: 700;
            color: var(--chat-color-text);
            margin-bottom: 20px;
            line-height: 1.3;
            padding: 0 8px;
        }

        .chat-assist-widget .chat-start-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            max-width: 100%;
            padding: 14px 20px;
            min-height: 48px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-radius: var(--chat-radius-md);
            cursor: pointer;
            font-size: 15px;
            transition: var(--chat-transition);
            font-weight: 600;
            font-family: inherit;
            margin-bottom: 16px;
            box-shadow: var(--chat-shadow-md);
            touch-action: manipulation;
            box-sizing: border-box;
        }

        .chat-assist-widget .chat-start-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--chat-shadow-lg);
        }

        .chat-assist-widget .chat-response-time {
            font-size: 14px;
            color: var(--chat-color-text-light);
            margin: 0;
        }

        .chat-assist-widget .chat-body {
            display: none !important;
            flex-direction: column;
            height: 100%;
            min-height: 0;
            position: relative;
            overflow: hidden;
            flex: 1 1 auto;
        }

        .chat-assist-widget .chat-body.active {
            display: flex !important;
            min-height: 0;
        }

        .chat-assist-widget .chat-messages {
            flex: 1 1 auto;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 16px 12px;
            background: #f9fafb;
            display: flex;
            flex-direction: column;
            gap: 12px;
            -webkit-overflow-scrolling: touch;
            min-height: 0;
            overscroll-behavior: contain;
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar {
            width: 6px;
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar-thumb {
            background-color: rgba(16, 185, 129, 0.3);
            border-radius: var(--chat-radius-full);
        }

        .chat-assist-widget .chat-bubble {
            padding: 12px 16px;
            border-radius: var(--chat-radius-md);
            max-width: 85%;
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: break-word;
            font-size: 14px;
            line-height: 1.6;
            position: relative;
            white-space: pre-line;
            box-sizing: border-box;
        }

        .chat-assist-widget .chat-bubble.user-bubble {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            box-shadow: var(--chat-shadow-sm);
        }

        .chat-assist-widget .chat-bubble.bot-bubble {
            background: white;
            color: var(--chat-color-text);
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            box-shadow: var(--chat-shadow-sm);
            border: 1px solid var(--chat-color-light);
        }

        /* Typing animation */
        .chat-assist-widget .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 14px 18px;
            background: white;
            border-radius: var(--chat-radius-md);
            border-bottom-left-radius: 4px;
            max-width: 80px;
            align-self: flex-start;
            box-shadow: var(--chat-shadow-sm);
            border: 1px solid var(--chat-color-light);
        }

        .chat-assist-widget .typing-dot {
            width: 8px;
            height: 8px;
            background: var(--chat-color-primary);
            border-radius: var(--chat-radius-full);
            opacity: 0.7;
            animation: typingAnimation 1.4s infinite ease-in-out;
        }

        .chat-assist-widget .typing-dot:nth-child(1) {
            animation-delay: 0s;
        }

        .chat-assist-widget .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .chat-assist-widget .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typingAnimation {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-4px);
            }
        }

        .chat-assist-widget .chat-controls {
            padding: 12px;
            background: var(--chat-color-surface);
            border-top: 1px solid var(--chat-color-light);
            display: flex;
            gap: 8px;
            flex-shrink: 0;
            z-index: 10;
            padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
            flex: 0 0 auto;
            position: sticky;
            bottom: 0;
        }

        .chat-assist-widget .chat-textarea {
            flex: 1;
            padding: 12px 14px;
            border: 1px solid var(--chat-color-light);
            border-radius: var(--chat-radius-md);
            background: var(--chat-color-surface);
            color: var(--chat-color-text);
            resize: none;
            font-family: inherit;
            font-size: 14px;
            line-height: 1.5;
            max-height: 120px;
            min-height: 44px;
            transition: var(--chat-transition);
            box-sizing: border-box;
            -webkit-appearance: none;
            appearance: none;
        }

        .chat-assist-widget .chat-textarea:focus {
            outline: none;
            border-color: var(--chat-color-primary);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }

        .chat-assist-widget .chat-textarea::placeholder {
            color: var(--chat-color-text-light);
        }

        .chat-assist-widget .chat-submit {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-radius: var(--chat-radius-md);
            min-width: 48px;
            width: auto;
            padding: 0 12px;
            height: 44px;
            min-height: 44px;
            cursor: pointer;
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: var(--chat-shadow-sm);
            touch-action: manipulation;
            box-sizing: border-box;
        }

        .chat-assist-widget .chat-submit:hover {
            transform: scale(1.05);
            box-shadow: var(--chat-shadow-md);
        }

        .chat-assist-widget .chat-submit svg {
            width: 22px;
            height: 22px;
            flex-shrink: 0;
        }

        .chat-assist-widget .chat-submit span {
            display: inline-block;
            white-space: nowrap;
        }

        .chat-assist-widget .chat-launcher {
            position: fixed;
            bottom: 20px;
            height: 56px;
            min-height: 56px;
            border-radius: var(--chat-radius-full);
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: var(--chat-shadow-md);
            z-index: 999;
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
            padding: 0 16px 0 12px;
            gap: 8px;
            max-width: calc(100vw - 40px);
            touch-action: manipulation;
            box-sizing: border-box;
        }

        .chat-assist-widget .chat-launcher.right-side {
            right: 20px;
            left: auto;
        }

        .chat-assist-widget .chat-launcher.left-side {
            left: 20px;
            right: auto;
        }

        .chat-assist-widget .chat-launcher:hover {
            transform: scale(1.05);
            box-shadow: var(--chat-shadow-lg);
        }

        .chat-assist-widget .chat-launcher svg {
            width: 24px;
            height: 24px;
        }
        
        .chat-assist-widget .chat-launcher-text {
            font-weight: 600;
            font-size: 14px;
            white-space: nowrap;
        }

        .chat-assist-widget .chat-footer {
            padding: 10px;
            text-align: center;
            background: var(--chat-color-surface);
            border-top: 1px solid var(--chat-color-light);
            flex-shrink: 0;
        }

        .chat-assist-widget .chat-footer-link {
            color: var(--chat-color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: var(--chat-transition);
            font-family: inherit;
        }

        .chat-assist-widget .chat-footer-link:hover {
            opacity: 1;
        }

        .chat-assist-widget .suggested-questions {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin: 12px 0;
            align-self: flex-start;
            max-width: 85%;
        }

        .chat-assist-widget .suggested-question-btn {
            background: #f3f4f6;
            border: 1px solid var(--chat-color-light);
            border-radius: var(--chat-radius-md);
            padding: 10px 14px;
            text-align: left;
            font-size: 13px;
            color: var(--chat-color-text);
            cursor: pointer;
            transition: var(--chat-transition);
            font-family: inherit;
            line-height: 1.4;
        }

        .chat-assist-widget .suggested-question-btn:hover {
            background: var(--chat-color-light);
            border-color: var(--chat-color-primary);
        }

        .chat-assist-widget .chat-link {
            color: var(--chat-color-primary);
            text-decoration: underline;
            word-break: break-all;
            transition: var(--chat-transition);
        }

        .chat-assist-widget .chat-link:hover {
            color: var(--chat-color-secondary);
            text-decoration: underline;
        }

        .chat-assist-widget .user-registration {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px 16px;
            text-align: center;
            width: 100%;
            max-width: 320px;
            display: none !important;
            box-sizing: border-box;
            overflow-y: auto;
            max-height: calc(100% - 72px);
        }

        .chat-assist-widget .user-registration.active {
            display: block !important;
        }

        .chat-assist-widget .registration-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--chat-color-text);
            margin-bottom: 16px;
            line-height: 1.3;
        }

        .chat-assist-widget .registration-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 16px;
        }

        .chat-assist-widget .form-field {
            display: flex;
            flex-direction: column;
            gap: 4px;
            text-align: left;
        }

        .chat-assist-widget .form-label {
            font-size: 14px;
            font-weight: 500;
            color: var(--chat-color-text);
        }

        .chat-assist-widget .form-input {
            padding: 12px 14px;
            border: 1px solid var(--chat-color-border);
            border-radius: var(--chat-radius-md);
            font-family: inherit;
            font-size: 16px;
            transition: var(--chat-transition);
            width: 100%;
            box-sizing: border-box;
            -webkit-appearance: none;
            appearance: none;
            min-height: 44px;
        }

        .chat-assist-widget .form-input:focus {
            outline: none;
            border-color: var(--chat-color-primary);
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }

        .chat-assist-widget .form-input.error {
            border-color: #ef4444;
        }

        .chat-assist-widget .error-text {
            font-size: 12px;
            color: #ef4444;
            margin-top: 2px;
        }

        .chat-assist-widget .submit-registration {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 14px 20px;
            min-height: 48px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-radius: var(--chat-radius-md);
            cursor: pointer;
            font-size: 15px;
            transition: var(--chat-transition);
            font-weight: 600;
            font-family: inherit;
            box-shadow: var(--chat-shadow-md);
            touch-action: manipulation;
            box-sizing: border-box;
        }

        .chat-assist-widget .submit-registration:hover {
            transform: translateY(-2px);
            box-shadow: var(--chat-shadow-lg);
        }

        .chat-assist-widget .submit-registration:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        .chat-assist-widget .form-checkbox-field {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            text-align: left;
            margin-top: 4px;
        }

        .chat-assist-widget .form-checkbox {
            margin-top: 2px;
            cursor: pointer;
            width: 18px;
            height: 18px;
            min-width: 18px;
            accent-color: var(--chat-color-primary);
        }

        .chat-assist-widget .form-checkbox-label {
            font-size: 13px;
            color: var(--chat-color-text);
            line-height: 1.5;
            cursor: pointer;
            user-select: none;
        }

        /* Mobile Responsive Styles */
        @media screen and (max-width: 480px) {
            .chat-assist-widget .chat-window {
                width: 100%;
                max-width: 100vw;
                height: 100dvh;
                max-height: 100dvh;
                top: 0;
                bottom: 0;
                left: 0 !important;
                right: 0 !important;
                border-radius: 0;
                border-left: none;
                border-right: none;
                border-bottom: none;
            }
            
            .chat-assist-widget.ios .chat-window {
                position: fixed;
                inset: 0;
                height: 100dvh;
                max-height: 100dvh;
                background: var(--chat-color-surface);
            }
            
            .chat-assist-widget .chat-window.right-side,
            .chat-assist-widget .chat-window.left-side {
                left: 0;
                right: 0;
            }

            .chat-assist-widget .chat-header {
                border-top-left-radius: 0;
                border-top-right-radius: 0;
                padding: 0 44px 0 12px;
            }

            .chat-assist-widget .chat-launcher {
                bottom: 16px;
                right: 16px !important;
                left: auto !important;
                max-width: calc(100vw - 32px);
                padding: 0 14px 0 10px;
            }

            .chat-assist-widget .chat-launcher.right-side,
            .chat-assist-widget .chat-launcher.left-side {
                right: 16px;
                left: auto;
            }

            .chat-assist-widget .chat-launcher-text {
                font-size: 13px;
                max-width: 160px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .chat-assist-widget .chat-welcome {
                padding: 16px 12px;
                max-width: 100%;
            }

            .chat-assist-widget .chat-welcome-title {
                font-size: 18px;
                margin-bottom: 16px;
                padding: 0 4px;
            }

            .chat-assist-widget .chat-start-btn {
                padding: 12px 16px;
                font-size: 14px;
                margin-bottom: 12px;
            }

            .chat-assist-widget .chat-messages {
                padding: 12px 10px;
                gap: 10px;
            }

            .chat-assist-widget .chat-bubble {
                padding: 10px 14px;
                max-width: 90%;
                font-size: 13px;
            }

            .chat-assist-widget .chat-controls {
                padding: 10px;
                gap: 6px;
                flex-shrink: 0;
            }

            .chat-assist-widget .chat-body {
                display: none !important;
            }
            
            .chat-assist-widget .chat-body.active {
                display: flex !important;
                min-height: 0;
                height: 100%;
                flex-direction: column;
            }

            .chat-assist-widget .chat-messages {
                min-height: 0;
                flex: 1 1 auto;
                overflow-y: auto;
            }

            .chat-assist-widget .chat-textarea {
                padding: 10px 12px;
                font-size: 16px;
                min-height: 44px;
            }

            .chat-assist-widget .chat-submit {
                min-width: 44px;
                height: 44px;
                min-height: 44px;
                padding: 0 10px;
            }

            .chat-assist-widget .chat-submit svg {
                width: 20px;
                height: 20px;
            }

            .chat-assist-widget .chat-submit span {
                display: none;
            }

            .chat-assist-widget .user-registration {
                padding: 16px 12px;
                max-width: 100%;
                max-height: calc(100 * var(--vh, 1vh) - 72px);
            }

            .chat-assist-widget .registration-title {
                font-size: 16px;
                margin-bottom: 12px;
            }

            .chat-assist-widget .registration-form {
                gap: 10px;
                margin-bottom: 12px;
            }

            .chat-assist-widget .form-input {
                padding: 10px 12px;
                font-size: 16px;
                min-height: 44px;
            }

            .chat-assist-widget .submit-registration {
                padding: 12px 16px;
                font-size: 14px;
                min-height: 44px;
            }

            .chat-assist-widget .suggested-questions {
                max-width: 90%;
                gap: 6px;
                margin: 10px 0;
            }

            .chat-assist-widget .suggested-question-btn {
                padding: 8px 12px;
                font-size: 12px;
            }
        }

        /* Small Mobile Devices (phones in portrait) */
        @media screen and (max-width: 360px) {
            .chat-assist-widget .chat-launcher {
                padding: 0 12px 0 8px;
                gap: 6px;
            }

            .chat-assist-widget .chat-launcher-text {
                font-size: 12px;
                max-width: 140px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .chat-assist-widget .chat-welcome-title {
                font-size: 16px;
            }

            .chat-assist-widget .chat-bubble {
                max-width: 92%;
                padding: 8px 12px;
            }

            .chat-assist-widget .chat-controls {
                padding: 8px;
            }

            .chat-assist-widget .chat-submit {
                min-width: 44px;
                width: 44px;
                padding: 0;
            }

            .chat-assist-widget .chat-submit span {
                display: none;
            }
        }

        /* Prevent horizontal scroll on mobile */
        @media screen and (max-width: 768px) {
            body {
                overflow-x: hidden;
            }
            
            .chat-assist-widget {
                max-width: 100vw;
                overflow-x: hidden;
            }
        }

        /* Landscape orientation on mobile */
        @media screen and (max-height: 500px) and (orientation: landscape) {
            .chat-assist-widget .chat-window {
                max-height: calc(100 * var(--vh, 1vh));
                height: calc(100 * var(--vh, 1vh));
                bottom: 0;
            }
            
            .chat-assist-widget .chat-controls {
                flex-shrink: 0;
            }

            .chat-assist-widget .chat-header {
                height: 60px;
                min-height: 60px;
                max-height: 60px;
            }

            .chat-assist-widget .chat-header-logo {
                max-height: 56px;
            }

            .chat-assist-widget .chat-welcome {
                padding: 12px;
            }

            .chat-assist-widget .chat-welcome-title {
                font-size: 16px;
                margin-bottom: 12px;
            }

            .chat-assist-widget .chat-messages {
                padding: 10px 8px;
            }
        }
    `;
    document.head.appendChild(widgetStyles);

    // Default configuration
    const defaultSettings = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: '',
                link: ''
            },
            termsCheckboxLabel: 'Agree to terms & conditions'
        },
        style: {
            primaryColor: '#10b981', // Green
            secondaryColor: '#059669', // Darker green
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#1f2937'
        },
        suggestedQuestions: [] // Default empty array for suggested questions
    };

    // Merge user settings with defaults
    const settings = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultSettings.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultSettings.branding, ...window.ChatWidgetConfig.branding },
            style: { 
                ...defaultSettings.style, 
                ...window.ChatWidgetConfig.style,
                // Force green colors if user provided purple
                primaryColor: window.ChatWidgetConfig.style?.primaryColor === '#854fff' ? '#10b981' : (window.ChatWidgetConfig.style?.primaryColor || '#10b981'),
                secondaryColor: window.ChatWidgetConfig.style?.secondaryColor === '#6b3fd4' ? '#059669' : (window.ChatWidgetConfig.style?.secondaryColor || '#059669')
            },
            suggestedQuestions: window.ChatWidgetConfig.suggestedQuestions || defaultSettings.suggestedQuestions
        } : defaultSettings;

    // Session tracking
    let conversationId = '';
    let isWaitingForResponse = false;

    // Create widget DOM structure
    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';
    
    // Detect iOS to enable platform-specific fixes
    const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
    if (isIOS) {
        widgetRoot.classList.add('ios');
    }

    // iOS-only viewport alignment helper
    let iosViewportListenersBound = false;
    let iosViewportRaf = 0;
    function setupIOSChatViewportHeight(rootElement) {
        if (!rootElement || !isIOS || iosViewportListenersBound) return;
        const updateHeight = () => {
            const vv = window.visualViewport;
            const viewportHeight = vv ? vv.height : window.innerHeight;
            const offsetTop = vv ? vv.offsetTop : 0;
            rootElement.style.height = viewportHeight + 'px';
            rootElement.style.maxHeight = viewportHeight + 'px';
            rootElement.style.top = '0';
            rootElement.style.bottom = 'auto';
            rootElement.style.transform = `translate3d(0, ${offsetTop}px, 0)`;
        };
        const scheduleRafUpdates = () => {
            cancelAnimationFrame(iosViewportRaf);
            const start = performance.now();
            const loop = () => {
                updateHeight();
                if (performance.now() - start < 500) {
                    iosViewportRaf = requestAnimationFrame(loop);
                }
            };
            iosViewportRaf = requestAnimationFrame(loop);
        };
        updateHeight();
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => {
                updateHeight();
                scheduleRafUpdates();
            });
            window.visualViewport.addEventListener('scroll', () => {
                updateHeight();
                scheduleRafUpdates();
            });
        } else {
            window.addEventListener('resize', updateHeight);
        }
        iosViewportListenersBound = true;
    }
    
    // Apply custom colors
    widgetRoot.style.setProperty('--chat-widget-primary', settings.style.primaryColor);
    widgetRoot.style.setProperty('--chat-widget-secondary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-tertiary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-surface', settings.style.backgroundColor);
    widgetRoot.style.setProperty('--chat-widget-text', settings.style.fontColor);

    // Create chat panel
    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    setupIOSChatViewportHeight(chatWindow);
    
    // Create welcome screen with header
    const headerLogoUrl = settings.branding.logo || '';
    const launcherLogoUrl = settings.branding.launcherLogo || settings.branding.logo || '';
    
    if (!headerLogoUrl) {
        console.warn('No header logo set in ChatWidgetConfig.branding.logo');
    } else {
        console.log('Header logo URL being used:', headerLogoUrl);
    }
    if (!launcherLogoUrl) {
        console.warn('No launcher logo set.');
    } else {
        console.log('Launcher logo URL being used:', launcherLogoUrl);
    }

    const welcomeScreenHTML = `
        <div class="chat-header">
            <img class="chat-header-logo" src="${headerLogoUrl}" alt="${settings.branding.name} Logo" onerror="this.style.display='none';">
            <button class="chat-close-btn">×</button>
        </div>
        <div class="chat-welcome">
            <h2 class="chat-welcome-title">${settings.branding.welcomeText}</h2>
            <button class="chat-start-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Start chatting
            </button>
            <p class="chat-response-time">${settings.branding.responseTimeText}</p>
        </div>
        <div class="user-registration">
            <h2 class="registration-title">Please enter your details to start chatting</h2>
            <form class="registration-form">
                <div class="form-field">
                    <label class="form-label" for="chat-user-name">Name</label>
                    <input type="text" id="chat-user-name" class="form-input" placeholder="Your name" required>
                    <div class="error-text" id="name-error"></div>
                </div>
                <div class="form-field">
                    <label class="form-label" for="chat-user-email">Email</label>
                    <input type="email" id="chat-user-email" class="form-input" placeholder="Your email address" required>
                    <div class="error-text" id="email-error"></div>
                </div>
                <div class="form-checkbox-field">
                    <input type="checkbox" id="chat-terms-checkbox" class="form-checkbox">
                    <label class="form-checkbox-label" for="chat-terms-checkbox">${settings.branding.termsCheckboxLabel}</label>
                </div>
                <button type="submit" class="submit-registration">Continue to Chat</button>
            </form>
        </div>
    `;

    // Create chat interface without duplicating the header
    const chatInterfaceHTML = `
        <div class="chat-body">
            <div class="chat-messages"></div>
            <div class="chat-controls">
                <textarea class="chat-textarea" placeholder="Send on the button..." rows="1"></textarea>
                <button class="chat-submit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 2L11 13"></path>
                        <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                    <span style="margin-left: 8px; font-size: 14px; font-weight: 600;">Send</span>
                </button>
            </div>
            <div class="chat-footer">
                <a class="chat-footer-link" href="${settings.branding.poweredBy.link}" target="_blank">${settings.branding.poweredBy.text}</a>
            </div>
        </div>
    `;
    
    chatWindow.innerHTML = welcomeScreenHTML + chatInterfaceHTML;
    
    // Create toggle button
    const launchButton = document.createElement('button');
    launchButton.className = `chat-launcher ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    launchButton.innerHTML = `
        <img src="${launcherLogoUrl}" alt="${settings.branding.name} Logo" onerror="this.style.display='none';" style="width: 32px; height: 32px; object-fit: contain; background: white; border-radius: var(--chat-radius-full); padding: 2px; box-shadow: 0 2px 6px rgba(0,0,0,0.07);">
        <span class="chat-launcher-text">Speak with team ${settings.branding.name}</span>`;
    
    // Add elements to DOM
    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    document.body.appendChild(widgetRoot);

    // View helpers
    const isMobileView = () => window.innerWidth <= 480;
    
    // Fix mobile viewport height issue (for mobile browsers with dynamic viewport)
    function setViewportHeight() {
        if (isIOS) return;
        const visualVp = window.visualViewport?.height || 0;
        const base = Math.max(window.innerHeight, visualVp);
        const vh = base * 0.01;
        document.documentElement.style.setProperty('--vh', vh + 'px');
        if (chatWindow.classList.contains('visible')) adjustChatWindowPosition();
    }
    
    // Adjust chat window position based on viewport
    function adjustChatWindowPosition() {
        if (isIOS) return;
        const isMobile = isMobileView();
        if (isMobile) {
            // On mobile, ensure window is at bottom and full height
            chatWindow.style.top = '0';
            chatWindow.style.bottom = '0';
            chatWindow.style.height = '100%';
            chatWindow.style.maxHeight = 'calc(100 * var(--vh, 1vh))';
        } else {
            // On desktop, maintain original CSS positioning
            chatWindow.style.bottom = '';
            chatWindow.style.top = '';
            chatWindow.style.height = '';
            chatWindow.style.maxHeight = '';
        }
    }
    
    // Track mobile keyboard and initial viewport height to freeze layout while focusing inputs
    let keyboardVisible = false;
    let initialViewportPx = Math.max(window.innerHeight, window.visualViewport?.height || 0);
    let lastViewportHeight = window.innerHeight;
    let focusTimeout;
    let blurTimeout;
    
    // Prevent background scroll while chat is open on mobile
    function lockPageScroll() {
        if (!isMobileView()) return;
        // Preserve current scroll position
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        document.documentElement.dataset.chatScrollY = String(scrollY);
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
        document.body.style.overscrollBehavior = 'none';
    }
    function unlockPageScroll() {
        document.documentElement.style.overflow = '';
        const savedY = Number(document.documentElement.dataset.chatScrollY || 0);
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overscrollBehavior = '';
        if (!isNaN(savedY)) {
            window.scrollTo(0, savedY);
        }
    }
    
    // Align chat window to the current visual viewport height (without changing position)
    function alignToVisualViewport() {
        if (!isMobileView() || !window.visualViewport) return;
        const vh = window.visualViewport.height * 0.01;
        document.documentElement.style.setProperty('--vh', vh + 'px');
    }
    function resetVisualViewportAlignment() {
        // No-op: we rely on CSS using --vh, nothing to reset on the element
    }
    
    // Precisely size the messages area to fill the space between header and controls
    function resizeMessagesArea() {
        const isMobile = isMobileView();
        const messagesEl = chatWindow.querySelector('.chat-messages');
        const headerEl = chatWindow.querySelector('.chat-header');
        const controlsEl = chatWindow.querySelector('.chat-controls');
        const footerEl = chatWindow.querySelector('.chat-footer');
        if (!messagesEl || !headerEl || !controlsEl) return;
        const windowHeight = chatWindow.clientHeight;
        const headerH = headerEl.getBoundingClientRect().height || 0;
        const controlsH = controlsEl.getBoundingClientRect().height || 0;
        const footerH = footerEl ? footerEl.getBoundingClientRect().height : 0;
        const verticalPadding = 0;
        const available = Math.max(0, windowHeight - headerH - controlsH - footerH - verticalPadding);
        // Apply sizing only on mobile or when explicitly needed
        if (isMobile) {
            messagesEl.style.height = available + 'px';
            messagesEl.style.maxHeight = available + 'px';
            messagesEl.style.overflowY = 'auto';
        } else {
            // Reset on desktop to let CSS handle it
            messagesEl.style.height = '';
            messagesEl.style.maxHeight = '';
            messagesEl.style.overflowY = '';
        }
    }
    
    // Ensure input stays above keyboard by padding the controls and messages
    function updateKeyboardOverlapPadding() {
        if (!isMobileView() || !window.visualViewport) return;
        const vv = window.visualViewport;
        const overlap = Math.max(0, (window.innerHeight - (vv.height + vv.offsetTop)));
        const controlsEl = chatWindow.querySelector('.chat-controls');
        const messagesEl = chatWindow.querySelector('.chat-messages');
        if (controlsEl) {
            controlsEl.style.bottom = overlap + 'px';
        }
        if (messagesEl) {
            messagesEl.style.paddingBottom = (12 + overlap) + 'px';
        }
    }
    
    // On iOS, the visual viewport can settle over 200-400ms. Keep anchoring during that time.
    let keyboardAnchorRaf = 0;
    function startKeyboardAnchorLoop() {
        if (!widgetRoot.classList.contains('ios')) return;
        const start = performance.now();
        cancelAnimationFrame(keyboardAnchorRaf);
        const step = () => {
            // Run for ~450ms or while keyboardVisible
            const elapsed = performance.now() - start;
            updateKeyboardOverlapPadding();
            scrollMessagesToBottom();
            if (keyboardVisible && elapsed < 450) {
                keyboardAnchorRaf = requestAnimationFrame(step);
            }
        };
        keyboardAnchorRaf = requestAnimationFrame(step);
    }
    function stopKeyboardAnchorLoop() {
        cancelAnimationFrame(keyboardAnchorRaf);
    }
    
    // Set initial viewport height
    setViewportHeight();
    
    // Update on resize and orientation change
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setViewportHeight();
        }, 100);
    }
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 200);
    });
    
    // Use visual viewport API for better keyboard detection
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleResize);
        window.visualViewport.addEventListener('scroll', () => {
            // Prevent unwanted scrolling when keyboard appears
            if (isMobileView() && window.visualViewport.height < window.innerHeight) {
                // Keyboard is likely visible
                setViewportHeight();
                // Keep conversation pinned only if the user is already at the bottom
                const msgContainer = chatWindow.querySelector('.chat-messages');
                if (isNearBottom(msgContainer) || widgetRoot.classList.contains('ios')) {
                    scrollMessagesToBottom();
                }
                resizeMessagesArea();
                updateKeyboardOverlapPadding();
            } else {
                // When keyboard closes, restore default alignment
                const controlsEl = chatWindow.querySelector('.chat-controls');
                const messagesEl = chatWindow.querySelector('.chat-messages');
                if (controlsEl) controlsEl.style.marginBottom = '';
                if (messagesEl) messagesEl.style.paddingBottom = '';
            }
        });
        // Also realign on resize events generally
        window.visualViewport.addEventListener('resize', () => {
            if (keyboardVisible && isMobileView()) {
                updateKeyboardOverlapPadding();
            }
        });
    }
    
    function handleTextareaFocus() {
        if (!isMobileView()) return;
        if (isIOS) {
            keyboardVisible = true;
            startKeyboardAnchorLoop();
            return;
        }
        keyboardVisible = true;
        lastViewportHeight = window.innerHeight;
        // Capture the initial viewport height once per open to keep overlay full-screen
        if (!initialViewportPx || initialViewportPx < 300) {
            initialViewportPx = Math.max(window.innerHeight, window.visualViewport?.height || 0);
        }
        clearTimeout(blurTimeout);
        // Small delay to let keyboard appear
        focusTimeout = setTimeout(() => {
            // Use current visual viewport height so layout matches available space above keyboard
            setViewportHeight();
            chatWindow.style.height = 'calc(100 * var(--vh, 1vh))';
            chatWindow.style.maxHeight = 'calc(100 * var(--vh, 1vh))';
            // Ensure the messages area exactly fits the remaining space
            resizeMessagesArea();
            updateKeyboardOverlapPadding();
            startKeyboardAnchorLoop();
            // Scroll only if the user is already near the bottom to avoid jumps
            const msgContainer = chatWindow.querySelector('.chat-messages');
            if (isNearBottom(msgContainer) || widgetRoot.classList.contains('ios')) {
                setTimeout(() => scrollMessagesToBottom(true), 100);
            }
        }, 300);
    }
    
    function handleTextareaBlur() {
        if (!isMobileView()) return;
        if (isIOS) {
            keyboardVisible = false;
            stopKeyboardAnchorLoop();
            const controlsEl = chatWindow.querySelector('.chat-controls');
            const messagesEl = chatWindow.querySelector('.chat-messages');
            if (controlsEl) controlsEl.style.bottom = '';
            if (messagesEl) messagesEl.style.paddingBottom = '';
            return;
        }
        keyboardVisible = false;
        clearTimeout(focusTimeout);
        // Delay to ensure keyboard is fully closed
        blurTimeout = setTimeout(() => {
            // Restore responsive height after keyboard hides
            chatWindow.style.height = '100%';
            chatWindow.style.maxHeight = 'calc(100 * var(--vh, 1vh))';
            setViewportHeight();
            adjustChatWindowPosition();
            resizeMessagesArea();
            const controlsEl = chatWindow.querySelector('.chat-controls');
            const messagesEl = chatWindow.querySelector('.chat-messages');
            if (controlsEl) controlsEl.style.bottom = '';
            if (messagesEl) messagesEl.style.paddingBottom = '';
            stopKeyboardAnchorLoop();
            // Ensure controls are visible and properly positioned
            const controls = chatWindow.querySelector('.chat-controls');
            if (controls) {
                // Force a reflow to ensure sticky positioning recalculates
                void controls.offsetHeight;
            }
        }, 300);
    }

    // Get DOM elements
    const startChatButton = chatWindow.querySelector('.chat-start-btn');
    const chatBody = chatWindow.querySelector('.chat-body');
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageTextarea = chatWindow.querySelector('.chat-textarea');
    const sendButton = chatWindow.querySelector('.chat-submit');
    
    // Registration form elements
    const registrationForm = chatWindow.querySelector('.registration-form');
    const userRegistration = chatWindow.querySelector('.user-registration');
    const chatWelcome = chatWindow.querySelector('.chat-welcome');
    const nameInput = chatWindow.querySelector('#chat-user-name');
    const emailInput = chatWindow.querySelector('#chat-user-email');
    const termsCheckbox = chatWindow.querySelector('#chat-terms-checkbox');
    const nameError = chatWindow.querySelector('#name-error');
    const emailError = chatWindow.querySelector('#email-error');

    // Helper function to generate unique session ID
    function createSessionId() {
        return crypto.randomUUID();
    }

    // Create typing indicator element
    function createTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        return indicator;
    }
    
    // Utility: keep messages scrolled to the latest entry
    function scrollMessagesToBottom(smooth = false) {
        const msgContainer = chatWindow.querySelector('.chat-messages');
        if (!msgContainer) return;
        const behavior = smooth ? 'smooth' : 'auto';
        msgContainer.scrollTo({ top: msgContainer.scrollHeight, behavior });
    }
    
    // Utility: detect if user is already viewing the latest messages
    function isNearBottom(container, threshold = 60) {
        if (!container) return true;
        const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
        return distanceFromBottom <= threshold;
    }

    // Function to convert URLs in text to clickable links
    function linkifyText(text) {
        // URL pattern that matches http, https, ftp links
        const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        
        // Convert URLs to HTML links
        return text.replace(urlPattern, function(url) {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${url}</a>`;
        });
    }

    // Show registration form
    function showRegistrationForm() {
        if (!chatWelcome || !userRegistration) {
            console.error('Registration form elements not found');
            return;
        }
        // Hide welcome screen with !important to override CSS
        chatWelcome.style.setProperty('display', 'none', 'important');
        // Show registration form
        userRegistration.classList.add('active');
        // Ensure chat body is hidden (remove active class)
        if (chatBody) {
            chatBody.classList.remove('active');
        }
    }

    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Handle registration form submission
    async function handleRegistration(event) {
        event.preventDefault();
        
        // Reset error messages
        nameError.textContent = '';
        emailError.textContent = '';
        nameInput.classList.remove('error');
        emailInput.classList.remove('error');
        
        // Get values
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        
        // Validate
        let isValid = true;
        
        if (!name) {
            nameError.textContent = 'Please enter your name';
            nameInput.classList.add('error');
            isValid = false;
        }
        
        if (!email) {
            emailError.textContent = 'Please enter your email';
            emailInput.classList.add('error');
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.classList.add('error');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Validate webhook URL
        if (!settings.webhook.url || settings.webhook.url.trim() === '') {
            console.error('Webhook URL is not configured');
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            errorMessage.textContent = "Configuration error: Webhook URL is not set. Please contact support.";
            messagesContainer.appendChild(errorMessage);
            return;
        }
        
        // Initialize conversation with user data
        conversationId = createSessionId();
        
        // First, load the session
        const sessionData = [{
            action: "loadPreviousSession",
            sessionId: conversationId,
            route: settings.webhook.route,
            metadata: {
                userId: email,
                userName: name
            }
        }];

        try {
            // Hide registration form
            if (userRegistration) {
                userRegistration.classList.remove('active');
            }
            // Show chat interface only after registration is complete
            if (chatBody) {
                chatBody.classList.add('active');
            }
            // Ensure welcome screen is hidden
            if (chatWelcome) {
                chatWelcome.style.setProperty('display', 'none', 'important');
            }
            // After switching screens, keep the thread in view
            resizeMessagesArea();
            scrollMessagesToBottom();
            
            // Show typing indicator
            const typingIndicator = createTypingIndicator();
            messagesContainer.appendChild(typingIndicator);
            
            // Load session with timeout and better error handling
            const sessionController = new AbortController();
            const sessionTimeout = setTimeout(() => sessionController.abort(), 120000); // 120 second timeout for long processing
            
            let sessionResponse;
            try {
                sessionResponse = await fetch(settings.webhook.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(sessionData),
                    signal: sessionController.signal,
                    mode: 'cors',
                    credentials: 'omit'
                });
                clearTimeout(sessionTimeout);
            } catch (fetchError) {
                clearTimeout(sessionTimeout);
                if (fetchError.name === 'AbortError') {
                    throw new Error('Request timed out after 2 minutes. The server is taking longer than expected. Please try again later.');
                }
                throw fetchError;
            }
            
            if (!sessionResponse.ok) {
                const errorText = await sessionResponse.text();
                console.error('Session load failed:', sessionResponse.status, errorText);
                throw new Error(`Server error: ${sessionResponse.status} ${sessionResponse.statusText}`);
            }
            
            const sessionResponseData = await sessionResponse.json();
            
            // Send user info as first message
            const userInfoMessage = `Name: ${name}\nEmail: ${email}`;
            
            const userInfoData = {
                action: "sendMessage",
                sessionId: conversationId,
                route: settings.webhook.route,
                chatInput: userInfoMessage,
                metadata: {
                    name: name,
                    email: email,
                    checked: termsCheckbox ? termsCheckbox.checked : false,
                    userId: email,
                    userName: name,
                    isUserInfo: true
                }
            };
            
            // Send user info with timeout and better error handling
            const userInfoController = new AbortController();
            const userInfoTimeout = setTimeout(() => userInfoController.abort(), 120000); // 120 second timeout for long processing
            
            let userInfoResponse;
            try {
                userInfoResponse = await fetch(settings.webhook.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(userInfoData),
                    signal: userInfoController.signal,
                    mode: 'cors',
                    credentials: 'omit'
                });
                clearTimeout(userInfoTimeout);
            } catch (fetchError) {
                clearTimeout(userInfoTimeout);
                if (fetchError.name === 'AbortError') {
                    throw new Error('Request timed out after 2 minutes. The server is taking longer than expected. Please try again later.');
                }
                throw fetchError;
            }
            
            if (!userInfoResponse.ok) {
                const errorText = await userInfoResponse.text();
                console.error('User info send failed:', userInfoResponse.status, errorText);
                throw new Error(`Server error: ${userInfoResponse.status} ${userInfoResponse.statusText}`);
            }
            
            const userInfoResponseData = await userInfoResponse.json();
            
            // Remove typing indicator
            messagesContainer.removeChild(typingIndicator);
            
            // Display initial bot message with clickable links
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-bubble bot-bubble';
            const messageText = Array.isArray(userInfoResponseData) ? 
                userInfoResponseData[0].output : userInfoResponseData.output;
            botMessage.innerHTML = linkifyText(messageText);
            messagesContainer.appendChild(botMessage);
            
            // Add sample questions if configured
            if (settings.suggestedQuestions && Array.isArray(settings.suggestedQuestions) && settings.suggestedQuestions.length > 0) {
                const suggestedQuestionsContainer = document.createElement('div');
                suggestedQuestionsContainer.className = 'suggested-questions';
                
                settings.suggestedQuestions.forEach(question => {
                    const questionButton = document.createElement('button');
                    questionButton.className = 'suggested-question-btn';
                    questionButton.textContent = question;
                    const handleQuestionClick = (e) => {
                        if (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        submitMessage(question);
                        // Remove the suggestions after clicking
                        if (suggestedQuestionsContainer.parentNode) {
                            suggestedQuestionsContainer.parentNode.removeChild(suggestedQuestionsContainer);
                        }
                    };
                    questionButton.addEventListener('click', handleQuestionClick);
                    questionButton.addEventListener('touchend', handleQuestionClick);
                    suggestedQuestionsContainer.appendChild(questionButton);
                });
                
                messagesContainer.appendChild(suggestedQuestionsContainer);
            }
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Registration error:', error);
            console.error('Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                webhookUrl: settings.webhook.url
            });
            
            // Remove typing indicator if it exists
            const indicator = messagesContainer.querySelector('.typing-indicator');
            if (indicator) {
                messagesContainer.removeChild(indicator);
            }
            
            // Show error message with more details
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            let errorText = "Sorry, I couldn't connect to the server. Please try again later.";
            // Check both error message and error name for timeout detection
            const isTimeout = error.name === 'AbortError' || (error.message && error.message.toLowerCase().includes('timeout'));
            if (isTimeout) {
                errorText = "Request timed out after 2 minutes. The server is taking longer than expected. Please try again later.";
            } else if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Network request failed'))) {
                errorText = "Network error. Please check your internet connection. If the problem persists, the server may be blocking requests from your network.";
            } else if (error.message && (error.message.includes('CORS') || error.message.includes('cross-origin'))) {
                errorText = "Connection blocked by browser security. Please contact support to configure CORS headers on the server.";
            } else if (error.message && error.message.includes('Server error')) {
                errorText = `Server error occurred (${error.message.match(/\d{3}/)?.[0] || 'Unknown'}). Please try again later.`;
            }
            errorMessage.textContent = errorText;
            messagesContainer.appendChild(errorMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Log detailed error for debugging (visible in browser console)
            console.error('=== CHATBOT ERROR DEBUG INFO ===');
            console.error('Error Type:', error.name);
            console.error('Error Message:', error.message);
            console.error('Webhook URL:', settings.webhook.url);
            console.error('User Agent:', navigator.userAgent);
            console.error('Is Mobile:', /Mobile|Android|iPhone|iPad/.test(navigator.userAgent));
            console.error('Full Error:', error);
            console.error('================================');
        }
    }

    // Send a message to the webhook
    async function submitMessage(messageText) {
        if (isWaitingForResponse) return;
        
        // Check if user has registered (conversationId must be set)
        if (!conversationId || conversationId.trim() === '') {
            console.error('Cannot send message: User not registered');
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            errorMessage.textContent = "Please register first by filling out the form.";
            if (messagesContainer) {
                messagesContainer.appendChild(errorMessage);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
            return;
        }
        
        // Check if webhook URL is configured
        if (!settings.webhook.url || settings.webhook.url.trim() === '') {
            console.error('Webhook URL is not configured');
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            errorMessage.textContent = "Configuration error: Webhook URL is not set. Please contact support.";
            if (messagesContainer) {
                messagesContainer.appendChild(errorMessage);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
            return;
        }
        
        isWaitingForResponse = true;
        
        // Get user info if available
        const email = nameInput ? nameInput.value.trim() : "";
        const name = emailInput ? emailInput.value.trim() : "";
        
        const requestData = {
            action: "sendMessage",
            sessionId: conversationId,
            route: settings.webhook.route,
            chatInput: messageText,
            metadata: {
                name: nameInput ? nameInput.value.trim() : "",
                email: emailInput ? emailInput.value.trim() : "",
                checked: termsCheckbox ? termsCheckbox.checked : false,
                userId: email,
                userName: name
            }
        };

        // Check if messagesContainer exists
        if (!messagesContainer) {
            console.error('Messages container not found');
            isWaitingForResponse = false;
            return;
        }
        
        // Display user message
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-bubble user-bubble';
        userMessage.textContent = messageText;
        messagesContainer.appendChild(userMessage);
        
        // Show typing indicator
        const typingIndicator = createTypingIndicator();
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            // Add timeout and better error handling
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 120000); // 120 second timeout for long processing
            
            let response;
            try {
                response = await fetch(settings.webhook.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(requestData),
                    signal: controller.signal,
                    mode: 'cors',
                    credentials: 'omit'
                });
                clearTimeout(timeout);
            } catch (fetchError) {
                clearTimeout(timeout);
                if (fetchError.name === 'AbortError') {
                    throw new Error('Request timed out after 2 minutes. Your question may be too complex or the server is taking longer than expected. Please try rephrasing your question or try again later.');
                }
                throw fetchError;
            }
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Message send failed:', response.status, errorText);
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
            
            const responseData = await response.json();
            
            // Remove typing indicator
            messagesContainer.removeChild(typingIndicator);
            
            // Display bot response with clickable links
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-bubble bot-bubble';
            const responseText = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            botMessage.innerHTML = linkifyText(responseText);
            messagesContainer.appendChild(botMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Message submission error:', error);
            console.error('Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                webhookUrl: settings.webhook.url
            });
            
            // Remove typing indicator
            messagesContainer.removeChild(typingIndicator);
            
            // Show error message with more details
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            let errorText = "Sorry, I couldn't send your message. Please try again.";
            // Check both error message and error name for timeout detection
            const isTimeout = error.name === 'AbortError' || (error.message && error.message.toLowerCase().includes('timeout'));
            if (isTimeout) {
                errorText = "Request timed out after 2 minutes. Your question may be too complex or the server is taking longer than expected. Please try rephrasing your question or try again later.";
            } else if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Network request failed'))) {
                errorText = "Network error. Please check your internet connection. If the problem persists, the server may be blocking requests from your network.";
            } else if (error.message && (error.message.includes('CORS') || error.message.includes('cross-origin'))) {
                errorText = "Connection blocked by browser security. Please contact support to configure CORS headers on the server.";
            } else if (error.message && error.message.includes('Server error')) {
                errorText = `Server error occurred (${error.message.match(/\d{3}/)?.[0] || 'Unknown'}). Please try again later.`;
            }
            errorMessage.textContent = errorText;
            messagesContainer.appendChild(errorMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Log detailed error for debugging (visible in browser console)
            console.error('=== CHATBOT ERROR DEBUG INFO ===');
            console.error('Error Type:', error.name);
            console.error('Error Message:', error.message);
            console.error('Webhook URL:', settings.webhook.url);
            console.error('User Agent:', navigator.userAgent);
            console.error('Is Mobile:', /Mobile|Android|iPhone|iPad/.test(navigator.userAgent));
            console.error('Full Error:', error);
            console.error('================================');
        } finally {
            isWaitingForResponse = false;
        }
    }

    // Auto-resize textarea as user types
    function autoResizeTextarea() {
        if (!messageTextarea) return;
        messageTextarea.style.height = 'auto';
        messageTextarea.style.height = (messageTextarea.scrollHeight > 120 ? 120 : messageTextarea.scrollHeight) + 'px';
    }

    // Ensure chat body is hidden initially and registration form is ready
    console.log('Initializing chat widget state...');
    console.log('conversationId:', conversationId);
    
    if (chatBody) {
        chatBody.classList.remove('active');
        console.log('Chat body: hidden (active class removed)');
    } else {
        console.error('Chat body element not found!');
    }
    
    if (userRegistration) {
        userRegistration.classList.remove('active');
        console.log('Registration form: hidden (active class removed)');
    } else {
        console.error('Registration form element not found!');
    }
    
    if (chatWelcome) {
        // Ensure welcome screen is visible by default (no inline style)
        if (chatWelcome.style.display === 'none') {
            chatWelcome.style.removeProperty('display');
        }
        console.log('Welcome screen: visible');
    } else {
        console.error('Welcome screen element not found!');
    }
    
    console.log('Chat widget initialized. Expected state: Welcome screen visible, registration hidden, chat body hidden');
    
    // Event listeners with error checking
    if (startChatButton) {
        // Add both click and touchstart for mobile support
        startChatButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showRegistrationForm();
        });
        startChatButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showRegistrationForm();
        });
    } else {
        console.error('Start chat button not found');
    }
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRegistration(e);
        });
    } else {
        console.error('Registration form not found');
    }
    
    if (sendButton) {
        sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const messageText = messageTextarea ? messageTextarea.value.trim() : '';
            if (messageText && !isWaitingForResponse) {
                submitMessage(messageText);
                if (messageTextarea) {
                    messageTextarea.value = '';
                    messageTextarea.style.height = 'auto';
                }
            }
        });
        // Add touch support for mobile
        sendButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const messageText = messageTextarea ? messageTextarea.value.trim() : '';
            if (messageText && !isWaitingForResponse) {
                submitMessage(messageText);
                if (messageTextarea) {
                    messageTextarea.value = '';
                    messageTextarea.style.height = 'auto';
                }
            }
        });
    } else {
        console.error('Send button not found');
    }
    
    if (messageTextarea) {
        messageTextarea.addEventListener('input', autoResizeTextarea);
        // While typing on mobile, ensure the latest messages are visible
        messageTextarea.addEventListener('input', () => {
            if (isMobileView()) {
                const msgContainer = chatWindow.querySelector('.chat-messages');
                if (isNearBottom(msgContainer)) {
                    scrollMessagesToBottom();
                }
            }
        });
        
        messageTextarea.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                const messageText = messageTextarea.value.trim();
                if (messageText && !isWaitingForResponse) {
                    submitMessage(messageText);
                    messageTextarea.value = '';
                    messageTextarea.style.height = 'auto';
                }
            }
        });
    } else {
        console.error('Message textarea not found');
    }
    
    // Attach keyboard visibility handlers
    if (messageTextarea) {
        messageTextarea.addEventListener('focus', handleTextareaFocus);
        messageTextarea.addEventListener('blur', handleTextareaBlur);
    }
    
    // Also handle form inputs
    if (nameInput) {
        nameInput.addEventListener('focus', handleTextareaFocus);
        nameInput.addEventListener('blur', handleTextareaBlur);
    }
    if (emailInput) {
        emailInput.addEventListener('focus', handleTextareaFocus);
        emailInput.addEventListener('blur', handleTextareaBlur);
    }
    
    // Function to reset chat to welcome screen
    function resetChatToWelcome() {
        // Reset conversation ID if user hasn't registered
        if (!conversationId || conversationId.trim() === '') {
            // Hide chat body (remove active class)
            if (chatBody) {
                chatBody.classList.remove('active');
            }
            // Hide registration form (remove active class)
            if (userRegistration) {
                userRegistration.classList.remove('active');
            }
            // Show welcome screen (remove inline display style to use CSS default)
            if (chatWelcome) {
                chatWelcome.style.removeProperty('display');
            }
        }
    }
    
    const handleLaunchButtonClick = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const isOpening = !chatWindow.classList.contains('visible');
        chatWindow.classList.toggle('visible');
        if (isOpening) {
            // When opening, reset to welcome screen if not registered
            resetChatToWelcome();
            // Capture the viewport height at open to use while keyboard is visible
            initialViewportPx = Math.max(window.innerHeight, window.visualViewport?.height || 0);
            // Prevent background page scroll on mobile
            lockPageScroll();
            // Ensure proper positioning
            setTimeout(() => {
                setViewportHeight();
                adjustChatWindowPosition();
                resizeMessagesArea();
                const msgContainer = chatWindow.querySelector('.chat-messages');
                if (isNearBottom(msgContainer)) {
                    scrollMessagesToBottom();
                }
            }, 100);
        } else {
            unlockPageScroll();
        }
    };
    
    launchButton.addEventListener('click', handleLaunchButtonClick);
    launchButton.addEventListener('touchend', handleLaunchButtonClick);

    // Close button functionality
    const closeButtons = chatWindow.querySelectorAll('.chat-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatWindow.classList.remove('visible');
            // Reset to welcome screen when closing if not registered
            resetChatToWelcome();
            unlockPageScroll();
        });
        // Add touch support for mobile
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            chatWindow.classList.remove('visible');
            resetChatToWelcome();
            unlockPageScroll();
        });
    });
    
    // Observe message container size/children to maintain bottom anchor during keyboard transitions
    const messagesEl = chatWindow.querySelector('.chat-messages');
    if (messagesEl) {
        const observer = new ResizeObserver(() => {
            if (keyboardVisible && isMobileView()) {
                resizeMessagesArea();
                if (isNearBottom(messagesEl)) scrollMessagesToBottom();
            }
        });
        observer.observe(messagesEl);
        const mo = new MutationObserver(() => {
            if (keyboardVisible && isMobileView()) {
                resizeMessagesArea();
                if (isNearBottom(messagesEl)) scrollMessagesToBottom();
            }
        });
        mo.observe(messagesEl, { childList: true, subtree: false });
    }
})();
