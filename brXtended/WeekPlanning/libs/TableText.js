define([], function () {
    'use strict';
    function TableText() {
        return {
            fr: {
                SUNDAY: "Dim",
                MONDAY: "Lun",
                TUESDAY: "Mar",
                WEDNESDAY: "Mer",
                THURSDAY: "Jeu",
                FRIDAY: "Ven",
                SATURDAY: "Sam"
            },
            en: {
                SUNDAY: "Sun",
                MONDAY: "Mon",
                TUESDAY: "Tue",
                WEDNESDAY: "Wed",
                THURSDAY: "Thu",
                FRIDAY: "Fri",
                SATURDAY: "Sat"
            },
            de: {
                SUNDAY: "Son",
                MONDAY: "Mon",
                TUESDAY: "Die",
                WEDNESDAY: "Mit",
                THURSDAY: "Don",
                FRIDAY: "Fre",
                SATURDAY: "Sam"
            }
        };
    }
    
    return new TableText();
});
