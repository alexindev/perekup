package logger

import (
	"backend/internal/config"
	"log/slog"
	"os"
	"time"
)

func New(cfg *config.Config) {
	var logHandler slog.Handler

	opts := slog.HandlerOptions{
		AddSource: true,
		ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
			if a.Key == slog.TimeKey {
				if t, ok := a.Value.Any().(time.Time); ok {
					return slog.String(slog.TimeKey, t.Format(time.DateTime))
				}
			}
			return a
		},
	}

	if cfg.Mode == "prod" {
		opts.Level = slog.LevelInfo
		logHandler = slog.NewJSONHandler(os.Stdout, &opts)
	} else {
		opts.Level = slog.LevelDebug
		logHandler = slog.NewTextHandler(os.Stdout, &opts)
	}

	logger := slog.New(logHandler)
	slog.SetDefault(logger)
}
