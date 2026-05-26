export function formatTimestamp(raw) {

    // already ISO
    const date =
        new Date(raw);

    return date.toLocaleString(

        'en-GB',

        {

            day: '2-digit',

            month: 'short',

            year: 'numeric',

            hour: '2-digit',

            minute: '2-digit',

            hour12: false,

            timeZone: 'UTC'
        }

    ) + ' UTC';
}