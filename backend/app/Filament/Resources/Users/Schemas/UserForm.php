<?php

namespace App\Filament\Resources\Users\Schemas;

use App\Models\User;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Identitas & Hak Akses Akun')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->label('Nama Lengkap')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('email')
                            ->label('Email')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Select::make('role')
                            ->label('Role Akses')
                            ->options([
                                'admin' => 'Admin (Manajemen Akun & Sistem)',
                                'operator' => 'Operator (Operasional & Konten)',
                                'wisatawan' => 'Wisatawan (Pengunjung)',
                            ])
                            ->required()
                            ->default('wisatawan'),
                        Toggle::make('is_active')
                            ->label('Status Akun Aktif')
                            ->helperText('Jika dimatikan, akun ditolak saat login ke Panel CMS maupun Website/API.')
                            ->default(true),
                        TextInput::make('password')
                            ->label('Kata Sandi')
                            ->password()
                            ->revealable()
                            ->minLength(8)
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->dehydrated(fn (?string $state): bool => filled($state))
                            ->helperText('Minimal 8 karakter. Kosongkan saat edit jika tidak ingin mengubah kata sandi.'),
                        TextInput::make('no_wa')
                            ->label('Nomor WhatsApp')
                            ->maxLength(25),
                        TextInput::make('nik')
                            ->label('NIK (16 Digit)')
                            ->maxLength(16),
                    ]),
                Section::make('Riwayat Login Terakhir')
                    ->columns(4)
                    ->visible(fn (?User $record): bool => $record !== null)
                    ->schema([
                        TextEntry::make('last_login_at_info')
                            ->label('Login Terakhir')
                            ->state(fn (?User $record): string => $record?->last_login_at?->format('d M Y H:i:s') ?? 'Belum pernah login'),
                        TextEntry::make('last_login_channel_info')
                            ->label('Jalur Login Terakhir')
                            ->state(fn (?User $record): string => $record?->last_login_channel ?? '-'),
                        TextEntry::make('last_login_ip_info')
                            ->label('IP Terakhir')
                            ->state(fn (?User $record): string => $record?->last_login_ip ?? '-'),
                        TextEntry::make('login_count_info')
                            ->label('Total Login')
                            ->state(fn (?User $record): string => (string) ($record?->login_count ?? 0) . ' kali'),
                    ]),
            ]);
    }
}
