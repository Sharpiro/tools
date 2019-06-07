characters=$1
items_per_second=$2

if [ -s $characters ]; then
    echo must provide number of characters
    exit 1
fi

if [ -s $items_per_second ]; then
    echo must provide items per second
    exit 1
fi

let bits_per_character=5
let total_bits=bits_per_character*characters
let max_items=2**total_bits
let total_seconds=max_items/items_per_second
let total_minutes=total_seconds/60
let total_hours=total_minutes/60
let total_days=total_hours/24
let total_years=total_days/365

echo $characters characters
printf "%'d total items\n" $max_items
printf "%'d items / second\n" $items_per_second

if [ $total_years -gt 0 ]; then
    echo $total_years total years
elif [ $total_days -gt 0 ]; then
    echo $total_days total days
elif [ $total_hours -gt 0 ]; then
    echo $total_hours total hours
elif [ $total_minutes -gt 0 ]; then
    echo $total_minutes total minutes
else
    echo $total_seconds total seconds
fi
