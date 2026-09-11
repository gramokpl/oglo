<?php

namespace App\Filament\Resources;

use App\Models\Listing;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Notifications\Notification;
use Illuminate\Support\Str;

class ListingResource extends Resource
{
    protected static ?string $model = Listing::class;
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationGroup = 'Zarządzanie Portalem';
    protected static ?string $modelLabel = 'Ogłoszenie';
    protected static ?string $pluralModelLabel = 'Ogłoszenia';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Podstawowe informacje')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Tytuł ogłoszenia')
                            ->required()
                            ->maxLength(120)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, Forms\Set $set) => $set('slug', Str::slug($state))),
                        
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->unique(Listing::class, 'slug', ignoreRecord: true),

                        Forms\Components\Select::make('category_id')
                            ->label('Kategoria')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),

                        Forms\Components\Select::make('user_id')
                            ->label('Właściciel / Autor')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),

                        Forms\Components\TextInput::make('price')
                            ->label('Cena (PLN)')
                            ->numeric()
                            ->prefix('PLN')
                            ->required(),

                        Forms\Components\Toggle::make('is_negotiable')
                            ->label('Do negocjacji'),
                    ])->columns(2),

                Forms\Components\Section::make('Treść i multimedia')
                    ->schema([
                        Forms\Components\RichEditor::make('description')
                            ->label('Opis (oczyszczany przez HTMLPurifier)')
                            ->required()
                            ->columnSpanFull(),

                        Forms\Components\FileUpload::make('images')
                            ->label('Zdjęcia')
                            ->multiple()
                            ->image()
                            ->maxFiles(8)
                            ->directory('listings/photos')
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Status i Promowanie')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->options([
                                'pending_review' => 'Oczekuje na zatwierdzenie',
                                'active' => 'Opublikowane',
                                'rejected' => 'Odrzucone przez moderatora',
                                'expired' => 'Wygasłe',
                            ])
                            ->required(),

                        Forms\Components\Toggle::make('is_promoted')
                            ->label('Wyróżnione na liście'),

                        Forms\Components\Toggle::make('is_vip')
                            ->label('Pakiet VIP (Strona Główna)'),

                        Forms\Components\DateTimePicker::make('featured_until')
                            ->label('Ważność promowania'),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('images')
                    ->circular()
                    ->stacked()
                    ->limit(2),
                Tables\Columns\TextColumn::make('title')
                    ->label('Tytuł')
                    ->searchable()
                    ->limit(35)
                    ->sortable(),
                Tables\Columns\TextColumn::make('category.name')
                    ->label('Kategoria')
                    ->badge(),
                Tables\Columns\TextColumn::make('price')
                    ->money('PLN')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending_review',
                        'success' => 'active',
                        'danger' => 'rejected',
                        'gray' => 'expired',
                    ]),
                Tables\Columns\IconColumn::make('is_vip')
                    ->label('VIP')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status'),
                Tables\Filters\TernaryFilter::make('is_vip')->label('Tylko VIP'),
                Tables\Filters\TernaryFilter::make('is_promoted')->label('Promowane'),
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->label('Zatwierdź')
                    ->icon('heroicon-m-check-badge')
                    ->color('success')
                    ->visible(fn (Listing $record) => $record->status !== 'active')
                    ->action(function (Listing $record) {
                        $record->update(['status' => 'active']);
                        Notification::make()
                            ->title('Ogłoszenie zostało zatwierdzone')
                            ->success()
                            ->send();
                    }),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
