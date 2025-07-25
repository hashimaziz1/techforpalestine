import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardMedia,
    Chip,
    Link,
    CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

interface EventItem {
    title: string;
    date: string;
    status: string;
    location: string;
    image: string;
    link: string;
    description?: string;
    registerLink?: string;
    recordingLink?: string;
}

export default function EventDetails() {
    const [event, setEvent] = useState<EventItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        if (id) {
            fetch(`/api/event-by-id?id=${id}`)
                .then((res) => res.json())
                .then((data) => setEvent(data))
                .catch((err) => console.error("Failed to fetch event:", err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <Box className="flex justify-center py-20">
                <CircularProgress />
            </Box>
        );
    }

    if (!event) {
        return (
            <p className="text-center py-20 text-gray-500">Event not found.</p>
        );
    }

    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const isPast = event.status?.toLowerCase() === "past";

    return (
        <Card className="p-6 rounded-2xl max-w-5xl mx-auto my-12 shadow-md bg-white">
            <Box className="aspect-video overflow-hidden rounded-xl mb-6">
                <CardMedia
                    component="img"
                    image={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
            </Box>

            <Typography variant="h4" className="font-bold mb-3 text-gray-900">
                {event.title}
            </Typography>

            <Box className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                {event.status && (
                    <Chip
                        label={event.status}
                        size="small"
                        sx={{
                            backgroundColor: isPast ? "#EA4335" : "#168039",
                            color: "#fff",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                        }}
                    />
                )}
                <span className="flex items-center gap-1">
          <LocationOnIcon fontSize="small" /> {event.location}
        </span>
                <span>{formattedDate}</span>
            </Box>

            {event.description && (
                <Typography
                    variant="body1"
                    className="text-gray-700 mb-6 leading-relaxed"
                >
                    {event.description}
                </Typography>
            )}

            <Box className="flex flex-wrap gap-6 pt-2">
                {event.registerLink && (
                    <Link
                        href={event.registerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#EA4335] hover:underline text-sm font-medium"
                    >
                        <EditCalendarIcon fontSize="small" />
                        Register
                    </Link>
                )}
                {event.recordingLink && (
                    <Link
                        href={event.recordingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#168039] hover:underline text-sm font-medium"
                    >
                        <VideoLibraryIcon fontSize="small" />
                        Recording
                    </Link>
                )}
            </Box>
        </Card>
    );
}
