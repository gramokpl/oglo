<?php

namespace App\Notifications;

use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ListingPromotedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Listing $listing,
        public string $tier
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $tierName = $this->tier === 'vip' ? 'VIP (Strona Główna)' : 'Wyróżnione na Liście';

        return (new MailMessage)
            ->subject('🎉 Twoje ogłoszenie zostało pomyślnie promowane!')
            ->greeting('Cześć, ' . $notifiable->name . '!')
            ->line('Płatność przez Stripe została zaksięgowana z sukcesem.')
            ->line("Ogłoszenie: **{$this->listing->title}**")
            ->line("Aktywowany pakiet: **{$tierName}** na okres 30 dni.")
            ->action('Zobacz swoje ogłoszenie', url("/ogloszenie/{$this->listing->slug}"))
            ->line('Dziękujemy za korzystanie z naszego serwisu ogłoszeniowego.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'listing_id' => $this->listing->id,
            'title' => $this->listing->title,
            'tier' => $this->tier,
        ];
    }
}
