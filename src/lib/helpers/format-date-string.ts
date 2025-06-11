interface TranslationMapper {
    [key: string]: string
}

const weekDaysTranslationMapping: TranslationMapper = {
    "Sunday": "Domingo",
    "Monday": "Segunda-Feira",
    "Tuesday": "Terça-Feira",
    "Wednesday": "Quarta-Feira",
    "Thursday": "Quinta-Feira",
    "Friday": "Sexta-Feira",
    "Saturday": "Sábado",
}


const monthsTranslationMapping: TranslationMapper = {
    "January": "Janeiro",
    "February": "Fevereiro",
    "March": "Março",
    "April": "Abril",
    "May": "Maio",
    "June": "Junho",
    "July": "Julho",
    "August": "Agosto",
    "September": "Setembro",
    "October": "Outubro",
    "November": "Novembro",
    "December": "Dezembro"
};

export function formatDateString(dateString: string) {
    // Create a Date object from the input date string
    const date = new Date(dateString);

    // Define options for date formatting
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long', // Full name of the day
        month: 'long', // Full name of the month
        day: 'numeric', // Numeric day
        hour: '2-digit', // 2-digit hour
        minute: '2-digit', // 2-digit minute
        timeZone: 'Europe/Lisbon', // Portugal's timezone
        hour12: false // 24-hour format
    };

    // Format the date using the options
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

    // Extract the time part separately to format it correctly
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit', // 2-digit hour
        minute: '2-digit', // 2-digit minute
        timeZone: 'Europe/Lisbon', // Portugal's timezone
        hour12: false // 24-hour format
    };

    const formattedTime = new Intl.DateTimeFormat('pt-PT', timeOptions).format(date);

    // Combine the date and time parts
    const [month, day,] = formattedDate.split(',')[1].trim().split(' ');

    return {
        day: day,
        month: monthsTranslationMapping[month],
        dayOfTheWeek: weekDaysTranslationMapping[formattedDate.split(",")[0]],
        time: formattedTime
    }

}
